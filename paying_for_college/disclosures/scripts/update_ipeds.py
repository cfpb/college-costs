import datetime
import json
import os
import sys
import zipfile
from subprocess import call

import requests
from unipath import Path
try:
    from csvkit import CSVKitDictReader as cdr
except:  # pragma: no cover
    from csv import DictReader as cdr
try:
    from csvkit import CSVKitWriter as cwriter
except:  # pragma: no cover
    from csv import writer as cwriter

from paying_for_college.views import get_school

SCRIPT = os.path.basename(__file__)[:-3]
PFC_ROOT = Path(__file__).ancestor(3)
# LATEST_YEAR specifies first year of academic-year data
# So 2014 would fetch data for 2014-2015 cycle
LATEST_YEAR = datetime.datetime.now().year-2
# For books and housing, IPEDS adds a column every year.
# Each new column gets an appended year-index value, starting with zero in 2011
YEAR_INDEX = LATEST_YEAR - 2011
ipeds_directory = '{}/data_sources/ipeds'.format(PFC_ROOT)
ipeds_data_url = 'http://nces.ed.gov/ipeds/datacenter/data'
data_slug = 'IC{}_AY'.format(LATEST_YEAR)
dictionary_slug = 'IC{}_AY_Dict'.format(LATEST_YEAR)

DATA_VARS = {
    'data_url': '{}/{}.zip'.format(ipeds_data_url, data_slug),
    'data_zip': '{}/{}.zip'.format(ipeds_directory, data_slug),
    'data_csv': '{}/{}.csv'.format(ipeds_directory, data_slug.lower()),
    'data_cleaned': '{}/{}_cleaned.csv'.format(ipeds_directory,
                                               data_slug.lower()),
    'dictionary_url': '{}/{}.zip'.format(ipeds_data_url, dictionary_slug),
    'dictionary_zip': '{}/{}.zip'.format(ipeds_directory, dictionary_slug),
    'dictionary_xlsx': '{}/{}.xlsx'.format(ipeds_directory, data_slug.lower()),
    'services_url': '{}/IC{}.zip'.format(ipeds_data_url, LATEST_YEAR),
    'services_zip': '{}/IC{}.zip'.format(ipeds_directory, LATEST_YEAR),
    'services_csv': '{}/ic{}.csv'.format(ipeds_directory, LATEST_YEAR),
    'services_cleaned': '{}/ic{}_cleaned.csv'.format(ipeds_directory,
                                                     LATEST_YEAR)
}

# mapping the vars of our data_json to the IPEDS data csv
# We pull only one value, 'ROOM', from the IPEDS services csv
DATA_POINTS = {
    'books': 'CHG4AY{}'.format(YEAR_INDEX),
    'otherOffCampus': 'CHG8AY{}'.format(YEAR_INDEX),
    'otherOnCampus': 'CHG6AY{}'.format(YEAR_INDEX),
    'otherWFamily': 'CHG9AY{}'.format(YEAR_INDEX),
    'roomBrdOffCampus': 'CHG7AY{}'.format(YEAR_INDEX),
    'roomBrdOnCampus': 'CHG5AY{}'.format(YEAR_INDEX),
    'tuitionGradInDis': 'TUITION5',
    'tuitionGradInS': 'TUITION6',
    'tuitionGradOss': 'TUITION7',
    'tuitionUnderInDis': 'TUITION1'
}


def unzip_file(filepath):
    """Unzip a .zip file and store contents in the ipeds directory"""
    zip_ref = zipfile.ZipFile(filepath, 'r')
    zip_ref.extractall(ipeds_directory)
    zip_ref.close()
    return True


def download_zip_file(url, zip_file):
    """Download a .zip file, unzip it, and then delete the .zip file"""
    resp = requests.get(url, stream=True)
    if resp.ok:
        with open(zip_file, 'wb') as f:
            for chunk in resp.iter_content(chunk_size=1024):
                if chunk:  # pragma: no cover
                    f.write(chunk)
        unzip_file(zip_file)
        call(['rm', zip_file])
        return True
    else:
        return False


def clean_csv_headings():
    """Strip nasty leading or trailing spaces from column headings"""
    for slug in ['data', 'services']:
        original_file = DATA_VARS['{}_csv'.format(slug)]
        cleaned_file = DATA_VARS['{}_cleaned'.format(slug)]
        with open(original_file, 'r') as f:
            reader = cdr(f)
            good_headings = [heading.strip() for heading in reader.fieldnames]
            with open(cleaned_file, 'w') as f2:
                writer = cwriter(f2)
                writer.writerow(good_headings)
                for row in reader:
                    writer.writerow([row[heading]
                                     for heading in reader.fieldnames])
    return True


def download_files():
    """
    Download and clean the latest IPEDS Institutional Characterstics files
    and the data dictionary for reference"""

    for slug in ['data', 'dictionary', 'services']:
        url = DATA_VARS['{}_url'.format(slug)]
        target = DATA_VARS['{}_zip'.format(slug)]
        target_slug = target.split('/')[-1]
        if download_zip_file(url, target):
            print "downloaded {}".format(target_slug)
        else:
            print "failed to download {}".format(target_slug)
    clean_csv_headings()


def process_datafiles():
    """Collect data points from 2 IPEDS csvs and deliver them as a dict"""
    collector = {}
    with open(DATA_VARS['services_cleaned'], 'r') as f:
        reader = cdr(f)
        for row in reader:
            collector[row['UNITID']] = {'onCampusAvail': row['ROOM']}
    with open(DATA_VARS['data_cleaned'], 'r') as f:
        reader = cdr(f)
        for row in reader:
            for key in DATA_POINTS:
                collector[row['UNITID']][key] = row[DATA_POINTS[key]]
    return collector


def load_values(dry_run=True):
    updated = 0
    missed = 0
    points = 0
    missing = []
    source_dict = process_datafiles()
    for ID in source_dict:
        new_data = source_dict[ID]
        school = get_school(ID)
        if school:
            school_data = json.loads(school.data_json)
            for data_key in new_data:
                school_data[data_key.upper()] = new_data[data_key]
                points += 1
            school.data_json = json.dumps(school_data)
            if not dry_run:
                school.save()
            updated += 1
        else:
            missed += 1
            missing.append(ID)
    if dry_run:
        msg = ("DRY RUN:\n"
               "{} would have updated {} data points "
               " for {} schools;\n"
               "{} schools could not be found".format(SCRIPT,
                                                      points,
                                                      updated,
                                                      missed))
    else:
        msg = ("{} updated {} data points "
               "for {} schools;\n"
               "{} schools could not be found".format(SCRIPT,
                                                      points,
                                                      updated,
                                                      missed))
    return msg
    # return missing
