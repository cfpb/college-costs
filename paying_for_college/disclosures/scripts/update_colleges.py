"""Update college data using the Dept. of Education's collegechoice api"""
from __future__ import print_function
import os
import ast
import sys
import time
import json
import datetime
# import pprint
# PP = pprint.PrettyPrinter(indent=4)

import requests

from paying_for_college.disclosures.scripts import api_utils
from paying_for_college.disclosures.scripts.api_utils import MODEL_MAP, LATEST_YEAR
from paying_for_college.models import School

DATESTAMP = datetime.datetime.now().strftime("%Y-%m-%d")
HOME = os.path.expanduser("~")
NO_DATA_FILE = "{0}/no_data_YEAR{1}_{2}.json".format(HOME,
                                                     LATEST_YEAR,
                                                     DATESTAMP)
SCRIPTNAME = os.path.basename(__file__)
ID_BASE = "{0}?api_key={1}".format(api_utils.SCHOOLS_ROOT, api_utils.API_KEY)
FIELDS = sorted(MODEL_MAP.keys())
FIELDSTRING = ",".join(FIELDS)


def fix_json(jstring):
    """attempt to fix a misquoted data_json string"""
    try:
        return ast.literal_eval(jstring)
    except:
        return {}


def fix_zip5(zip5):
    """add leading zeros if they have been stripped by the scorecard db"""
    if len(zip5) == 4:
        return "0{0}".format(zip5)
    if len(zip5) == 3:
        return "00{0}".format(zip5)
    else:
        return zip5

STARTMSG = """Getting school data for year {0}.
This job is paced to be kind to the Ed API, so it can take an hour to run."""


def update(exclude_ids=[], single_school=None):
    """update college-level data for current year"""
    print(STARTMSG.format(LATEST_YEAR))
    FAILED = []  # failed to get a good API response
    NO_DATA = []  # API responded with no data
    CLOSED = 0  # schools that have closed since our last scrape
    updated = False
    starter = datetime.datetime.now()
    processed = 0
    update_count = 0
    id_url = "{0}&id={1}&fields={2}"
    if single_school:
        base_query = School.objects.filter(pk=single_school)
        print("updating {0}".format(base_query[0]))
    else:
        base_query = School.objects.filter(operating=True)
        if exclude_ids:
            base_query = base_query.exclude(pk__in=exclude_ids)
    for school in base_query:
        processed += 1
        sys.stdout.write('.')
        sys.stdout.flush()
        if processed % 500 == 0:  # pragma: no cover
            print("\n{0}\n".format(processed))
        if processed % 5 == 0:
            time.sleep(1)
        url = id_url.format(ID_BASE, school.school_id, FIELDSTRING)
        # print(url)
        try:
            resp = requests.get(url)
        except:
            FAILED.append(school)
            continue
        else:
            if resp.ok is True:
                raw_data = resp.json()
                if raw_data and raw_data['results']:
                    data = raw_data['results'][0]
                    for key in MODEL_MAP:
                        if key in data.keys() and data[key] is not None:
                            setattr(school, MODEL_MAP[key], data[key])
                            updated = True
                    if school.grad_rate_4yr:
                        school.grad_rate == school.grad_rate_4yr
                    elif school.grad_rate_lt4:
                        school.grad_rate == school.grad_rate_lt4
                    if school.operating is False:
                        CLOSED += 1
                    # try:
                    #     data_dict = json.loads(school.data_json)
                    # except ValueError:
                    #     bad_json_count += 1
                    #     # print("data_json wouldn't load on first try for {0}".format(school))
                    #     data_dict = fix_json(school.data_json)
                    # if data_dict:
                    #     for key in JSON_MAP:
                    #         if key in data.keys():
                    #             data_dict[JSON_MAP[key]] = data[key]
                    #             updated = True
                    #         else:
                    #             data_dict[JSON_MAP[key]] = None
                    # else:
                    #     BAD_JSON.append(school)
                    #     # print("second json parsing attempt failed for {0}".format(school))
                    if updated is True:
                        update_count += 1
                        # school.data_json = json.dumps(data_dict)
                        school.zip5 = fix_zip5(str(school.zip5))
                        school.save()
                else:
                    sys.stdout.write('-')
                    sys.stdout.flush()
                    NO_DATA.append(school)
            else:
                print("request not OK, returned {0}".format(resp.reason))
                FAILED.append(school)
                if resp.status_code == 429:
                    print("API limit reached")
                    print(resp.content)
                    break
                else:
                    print("request for {0} returned {1}".format(school,
                                                              resp.status_code))
                    continue
    endmsg = "\nTried to get new data for {0} schools:\n\
    updated {1} and found no data for {2}\n\
    API response failures: {3}; schools that closed since last run: {4}\n\
    \n{5} took {6} to run".format(processed,
                                  update_count,
                                  len(NO_DATA),
                                  len(FAILED),
                                  CLOSED,
                                  SCRIPTNAME,
                                  (datetime.datetime.now()-starter))
    if NO_DATA:
        endmsg += "\nA list of schools that had no API data was saved to {0}".format(NO_DATA_FILE)
        no_data_dict = {}
        for school in NO_DATA:
            no_data_dict[school.pk] = school.primary_alias
        with open(NO_DATA_FILE, 'w') as f:
            f.write(json.dumps(no_data_dict))
    print(endmsg)
    return (FAILED, NO_DATA, endmsg)

if __name__ == '__main__':
    (failed, no_data, endmsg) = update()
