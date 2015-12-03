"""Update college data using the Dept. of Education's collegechoice api

We store broad, slow-changing values on the School model.
More specific and changeable values are stored in the model's data_json field
"""
import os
import sys
import time
import datetime
# import pprint
# PP = pprint.PrettyPrinter(indent=4)

from paying_for_college.disclosures.scripts import api_utils
from paying_for_college.disclosures.scripts.api_utils import MODEL_MAP, JSON_MAP
from paying_for_college.models import School

SCRIPTNAME = os.path.basename(__file__)
ID_BASE = "%s?api_key=%s" % (api_utils.SCHOOLS_ROOT, api_utils.API_KEY)
FAILED = []
NO_DATA = []
FIELDS = sorted(MODEL_MAP.keys() + JSON_MAP.keys())


def update():
    """update college-level data for current year"""
    starter = datetime.datetime.now()
    school_count = 0
    updated = 0
    ope6_count = 0
    ope8_count = 0
    id_url = "%s&id=%s&fields=%s"
    for school in School.objects.all():
        school_count += 1
        sys.stdout.write('.')
        sys.stdout.flush()
        if school_count % 500 == 0:
            print(school_count)
        url = id_url % (ID_BASE, school.school_id, FIELDS)
        try:
            resp = requests.get(url)
        except:
            FAILED.append(school)
            continue
        else:
            if resp.ok:
                time.sleep(1)
                data = resp.json()
                if data:
                    updated += 1
                    for key in MODEL_MAP:
                        setattr(school, MODEL_MAP[key], data[key])
                    sjson = json.loads(school.data_json)
                    for key in JSON_MAP:
                        sjson[JSON_MAP[key]] = data[key]
                        school.data_json = sjson
                        school.save()
                else:
                    NO_DATA.append(school)
            else:
                FAILED.append(school)
                if resp.status_code == 429:
                    print("API limit reached")
                    print(resp.content)
                    break
                else:
                    print("request for %s returned %s" % (school,
                                                          resp.status_code))
                    continue
    endmsg = "checked %s schools\n\
    updated %s and found no data for %s\n\
    failed to update %s\n\
    %s took %s to run" % (school_count,
                          updated,
                          len(NO_DATA),
                          len(FAILED),
                          SCRIPTNAME,
                          (datetime.datetime.now()-starter))
    print(endmsg)
    return (FAILED, NO_DATA, endmsg)
