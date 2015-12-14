"""Update college data using the Dept. of Education's collegechoice api

We store broad, slow-changing values on the School model.
More specific and changeable values are stored in the model's data_json field
"""
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
from paying_for_college.disclosures.scripts.api_utils import MODEL_MAP, JSON_MAP
from paying_for_college.models import School

DATESTAMP = datetime.datetime.now().strftime("%Y-%m-%d")
HOME = os.path.expanduser("~")
NO_DATA_FILE = "{}/no_data_{}.json".format(HOME, DATESTAMP)
SCRIPTNAME = os.path.basename(__file__)
ID_BASE = "{}?api_key={}".format(api_utils.SCHOOLS_ROOT, api_utils.API_KEY)
FIELDS = sorted(MODEL_MAP.keys() + JSON_MAP.keys())
FIELDSTRING = ",".join(FIELDS)


def fix_json(jstring):
    """attempt to fix a misquoted data_json string"""
    try:
        return ast.literal_eval(jstring)
    except:
        return {}


def update():
    """update college-level data for current year"""
    print("This job is paced to be kind to the Ed API;\n\
          it can take an hour or more to run.")
    FAILED = []  # failed to get a good API response
    NO_DATA = []  # API responded with no data
    BAD_JSON = []  # catch School objects that have malformed data_json
    updated = False
    starter = datetime.datetime.now()
    processed = 0
    update_count = 0
    bad_json_count = 0
    id_url = "{}&id={}&fields={}"
    for school in School.objects.filter(operating=True)[:20]:
        # print("{}".format(school))
        processed += 1
        sys.stdout.write('.')
        sys.stdout.flush()
        if processed % 500 == 0:  # pragma: no cover
            print("\n{}\n".format(processed))
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
                        if key in data.keys():
                            setattr(school, MODEL_MAP[key], data[key])
                            updated = True
                    try:
                        data_dict = json.loads(school.data_json)
                    except ValueError:
                        bad_json_count += 1
                        # print("data_json wouldn't load on first try for {}".format(school))
                        data_dict = fix_json(school.data_json)
                    if data_dict:
                        for key in JSON_MAP:
                            if key in data.keys():
                                data_dict[JSON_MAP[key]] = data[key]
                                updated = True
                            else:
                                data_dict[JSON_MAP[key]] = None
                    else:
                        BAD_JSON.append(school)
                        # print("second json parsing attempt failed for {}".format(school))
                    if updated is True:
                        update_count += 1
                        school.data_json = json.dumps(data_dict)
                        school.save()
                else:
                    sys.stdout.write('-')
                    sys.stdout.flush()
                    NO_DATA.append(school)
            else:
                print("request not OK, returned {}".format(resp.reason))
                FAILED.append(school)
                if resp.status_code == 429:
                    print("API limit reached")
                    print(resp.content)
                    break
                else:
                    print("request for {} returned {}".format(school,
                                                              resp.status_code))
                    continue
    endmsg = "\nTried to get new data for {} schools:\n\
    updated {} and found no data for {}\n\
    API response failures: {}\n\
    {} schools had malformed data_json; {} of those couldn't be fixed.\n\
    \n{} took {} to run".format(processed,
                                update_count,
                                len(NO_DATA),
                                len(FAILED),
                                bad_json_count,
                                len(BAD_JSON),
                                SCRIPTNAME,
                                (datetime.datetime.now()-starter))
    if NO_DATA:
        endmsg += "\nA list of schools that had no API data was saved to {}".format(NO_DATA_FILE)
        no_data_dict = {}
        for school in NO_DATA:
            no_data_dict[school.pk] = school.primary_alias
        with open(NO_DATA_FILE, 'w') as f:
            f.write(json.dumps(no_data_dict))
    print(endmsg)
    return (FAILED, NO_DATA, endmsg)

if __name__ == '__main__':
    (failed, no_data, endmsg) = update()
