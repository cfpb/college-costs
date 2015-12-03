"""
Utilities for querying thepaying_for_college/disclosures/scripts/api_exploration.py Dept of Ed's collegescorecard api

The API, released 2015-09-12, requires a key, which you can get
from https://api.data.gov/signup/
- API repo:
    https://github.com/18F/open-data-maker
- collegechoice repo:
    https://github.com/18F/college-choice
- raw data:
    https://s3.amazonaws.com/ed-college-choice-public/CollegeScorecard_Raw_Data.zip
- api_key usage:
    https://api.data.gov/docs/api-key/
"""
import sys
import os
import requests
import json
import datetime
from copy import copy
from decimal import Decimal

from csvkit import CSVKitWriter as ckw

API_KEY = os.getenv('ED_API_KEY')
API_ROOT = "https://api.data.gov/ed/collegescorecard/v1"
SCHOOLS_ROOT = "%s/schools" % API_ROOT
# SCHEMA_ROOT = "%s/data.json" % API_ROOT
PAGE_MAX = 100  # the max page size allowed as of 2015-09-14

MODEL_MAP = {
    'ope6_id': 'ope6_id',
    'ope8_id': 'ope8_id',
    '%s.student.size' % LATEST_YEAR: 'enrollment',
    'school.accreditor': 'accreditor',
    'school.school_url': 'url',
    'school.degrees_awarded.predominant': 'degrees_predominant',  # data guide says this is INDICATORGROUP
    'school.degrees_awarded.highest': 'degrees_highest',
    'school.ownership': 'ownership',
    'school.main_campus': 'main_campus',
    # 'school.branches',  # ??
    'school.online_only': 'online_only',
    'school.operating': 'operating',
    'school.under_investigation',
}

JSON_MAP ={
    '%s.student.retention_rate.four_year.full_time' % LATEST_YEAR: 'RETENTRATE',
    '%s.student.retention_rate.lt_four_year.full_time' % LATEST_YEAR: 'RETENTRATELT4',  # NEW
    '%s.repayment.repayment_cohort.3_year_declining_balance' % LATEST_YEAR: 'REPAY3YR',  # NEW
    '%s.repayment.3_yr_default_rate' % LATEST_YEAR: 'DEFAULTRATE',
    '%s.aid.median_debt_suppressed.overall' % LATEST_YEAR: 'AVGSTULOANDEBT',
    '%s.aid.median_debt_suppressed.completers.monthly_payments' % LATEST_YEAR: 'MEDIANDEBTCOMPLETER',  # NEW
}

BASE_STRING = [
    'id',
    'ope6_id',
    'ope8_id',
    'school.name',
    'school.city',
    'school.state',
    'school.zip',
    'school.accreditor',
    'school.school_url',
    'school.degrees_awarded.predominant',
    'school.degrees_awarded.highest',
    'school.ownership',
    'school.main_campus',
    'school.branches',
    'school.online_only',
    'school.operating',
    'school.under_investigation',
]


def build_csv_fields(YEAR=LATEST_YEAR):
    """assemble fields for an api query for an analysis csv"""
    fields = BASE_STRING + [
        '%s.cost.attendance.academic_year' % YEAR,
        '%s.cost.attendance.program_year' % YEAR,
        '%s.cost.tuition.in_state' % YEAR,
        '%s.cost.tuition.out_of_state' % YEAR,
        '%s.cost.tuition.program_year' % YEAR,
        '%s.student.fafsa_sent.2_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.3_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.4_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.5plus_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.overall' % YEAR,
        '%s.student.fafsa_sent.1_college' % YEAR,
        '%s.student.fafsa_sent.2_colleges' % YEAR,
        '%s.student.fafsa_sent.3_college' % YEAR,  # yes, should be 'colleges'
        '%s.student.fafsa_sent.4_colleges' % YEAR,
        '%s.student.fafsa_sent.5_or_more_colleges' % YEAR,
        '%s.student.fafsa_sent.2_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.3_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.4_college_allyrs' % YEAR,
        '%s.student.fafsa_sent.5plus_college_allyrs' % YEAR,
        '%s.student.size' % YEAR,
        '%s.student.enrollment.all' % YEAR,  # blank for many schools
        '%s.admissions.admission_rate.overall' % YEAR,
        '%s.admissions.admission_rate.by_ope_id' % YEAR,
        '%s.student.retention_rate.four_year.full_time' % YEAR,
        '%s.student.retention_rate.lt_four_year.full_time' % YEAR,
        '%s.student.retention_rate.four_year.part_time' % YEAR,
        '%s.student.retention_rate.lt_four_year.part_time' % YEAR,
        '%s.student.demographics.veteran' % YEAR,  # blank for many schools
        '%s.aid.federal_loan_rate' % YEAR,
        '%s.aid.cumulative_debt.number' % YEAR,
        '%s.aid.cumulative_debt.90th_percentile' % YEAR,
        '%s.aid.cumulative_debt.75th_percentile' % YEAR,
        '%s.aid.cumulative_debt.25th_percentile' % YEAR,
        '%s.aid.cumulative_debt.10th_percentile' % YEAR,
        '%s.aid.median_debt_suppressed.overall' % YEAR,
        '%s.aid.median_debt_suppressed.completers.overall' % YEAR,
        '%s.aid.median_debt_suppressed.completers.monthly_payments' % YEAR,
        '%s.aid.students_with_any_loan' % YEAR,
        '%s.repayment.3_yr_repayment_suppressed.overall' % YEAR,
        '%s.repayment.repayment_cohort.1_year_declining_balance' % YEAR,
        '%s.repayment.1_yr_repayment.completers' % YEAR,
        '%s.repayment.1_yr_repayment.noncompleters' % YEAR,
        '%s.repayment.repayment_cohort.3_year_declining_balance' % YEAR,
        '%s.repayment.3_yr_repayment.completers' % YEAR,
        '%s.repayment.3_yr_repayment.noncompleters' % YEAR,
        '%s.repayment.repayment_cohort.5_year_declining_balance' % YEAR,
        '%s.repayment.5_yr_repayment.completers' % YEAR,
        '%s.repayment.5_yr_repayment.noncompleters' % YEAR,
        '%s.repayment.repayment_cohort.7_year_declining_balance' % YEAR,
        '%s.repayment.7_yr_repayment.completers' % YEAR,
        '%s.repayment.7_yr_repayment.noncompleters' % YEAR,
        '%s.earnings.6_yrs_after_entry.working_not_enrolled.mean_earnings' % YEAR,
        '%s.earnings.6_yrs_after_entry.median' % YEAR,
        '%s.earnings.6_yrs_after_entry.percent_greater_than_25000' % YEAR,
        '%s.earnings.7_yrs_after_entry.mean_earnings' % YEAR,
        '%s.earnings.7_yrs_after_entry.percent_greater_than_25000' % YEAR,
        '%s.earnings.8_yrs_after_entry.mean_earnings' % YEAR,
        '%s.earnings.8_yrs_after_entry.median_earnings' % YEAR,
        '%s.earnings.8_yrs_after_entry.percent_greater_than_25000' % YEAR,
        '%s.earnings.9_yrs_after_entry.mean_earnings' % YEAR,
        '%s.earnings.9_yrs_after_entry.percent_greater_than_25000' % YEAR,
        '%s.earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings' % YEAR,
        '%s.earnings.10_yrs_after_entry.median' % YEAR,
        '%s.earnings.10_yrs_after_entry.percent_greater_than_25000' % YEAR,
        ]
    field_string = ",".join([field for field in fields])
    return field_string


def get_schools_by_page(year, page=0):
    """get a page of schools for a single year as dict"""
    field_string = build_string(year)
    url = "%s?api_key=%s&page=%s&per_page=%s&fields=%s" % (SCHOOLS_ROOT,
                                                           API_KEY,
                                                           PAGE_MAX,
                                                           field_string)
    data = json.loads(requests.get(url).text)
    return data


def search_by_school_name(name):
    """search api by school name, return school name, id, city, state"""
    fields = "id,school.name,school.city,school.state"
    url = "%s?api_key=%s&school.name=%s&fields=%s" % (SCHOOLS_ROOT,
                                                      API_KEY,
                                                      name,
                                                      fields)
    data = json.loads(requests.get(url).text)['results']
    return data


def get_school_data(school_id):
    """get a full api data set for a single school as dict"""
    school_id = "%s" % school_id
    url = "%s?id=%s&api_key=%s" % (SCHOOLS_ROOT, school_id, API_KEY)
    data = json.loads(requests.get(url).text)['results'][0]
    return data


def get_school_size(school_id, year):
    sdata = get_school_data(school_id)
    return year, sdata['school']['name'], sdata[str(year)]['student']['size']


def get_all_school_ids():
    """traverse pages, assemble all school ids and names and output as json."""
    collector = {}
    url = '%s?api_key=%s&fields=id,school.name' % (SCHOOLS_ROOT, API_KEY)
    for page in range(1, 391):
        next_url = "%s&page=%s" % (url, page)
        nextdata = json.loads(requests.get(next_url).text)
        for entry in nextdata['results']:
            collector[entry['id']] = entry['school.name']
    with open('school_ids.json', 'w') as f:
        f.write(json.dumps(collector))


def export_spreadsheet(year):
    """traverse pages and assemble all school ids and names"""
    starter = datetime.datetime.now()
    fields = build_string(year)
    headings = fields.replace('.', '_').split(',')
    collector = {}
    container = {}
    for key in headings:
        container[key] = ''
    url = '%s?api_key=%s&per_page=%s&fields=%s' % (SCHOOLS_ROOT,
                                                   API_KEY,
                                                   PAGE_MAX,
                                                   fields)
    data = json.loads(requests.get(url).text)
    #  initial pass
    if 'results' not in data:
        print 'no results'
        return data
    for school in data['results']:
        collector[school['id']] = copy(container)
        for key, value in school.iteritems():
            collector[school['id']][key.replace('.', '_')] = value
    next_page = data['metadata']['page'] + 1
    more_data = True
    #  harvest rest of pages
    while more_data:
        print "getting page %s" % next_page
        next_url = "%s&page=%s" % (url, next_page)
        nextdata = json.loads(requests.get(next_url).text)
        if len(nextdata['results']) == 0:
            more_data = False
            print "no more pages; exporting ..."
        else:
            for school in nextdata['results']:
                collector[school['id']] = opy(container)
                for key, value in school.iteritems():
                    collector[school['id']][key.replace('.', '_')] = value
            next_page = nextdata['metadata']['page'] + 1
    with open('schools_%s.csv' % year, 'w') as f:
        writer = ckw(f)
        writer.writerow(headings)
        for school_id in collector:
            writer.writerow([
                             collector[school_id][field]
                             for field in headings
                             ])
    print "export_spreadsheet took %s to process schools\
    for the year %s" % ((datetime.datetime.now()-starter), year)
    return data

if __name__ == '__main__':  # pragma: no cover
    try:
        param = sys.argv[1]
    except:
        print "please provide a 4-digit year"
    else:
        if len(param) == 4:
            try:
                year = int(param)
            except:
                print "please provide a valid year"
            else:
                export_spreadsheet(year)
        else:
            print "please provide a valid 4-digit year"


def unpack_alias(alist, school):
    "create aliases for a list of concatinated aliases"
    for alias in alist:
        new, created = Alias.objects.get_or_create(alias=alias,
                                                   institution=school,
                                                   defaults={'is_primary':
                                                             False})


def calculate_percent(group1, group2):
    """calculates one group's percentage of a two-group total"""
    if group1 + group2 == 0:
        return 0
    else:
        return Decimal(str(round(group1 * 100.0 / (group1 + group2), 2)))


# USF = 137351
def get_repayment_data(school_id, year):
    """return metric on student debt repayment"""
    school_id = "%s" % school_id
    entrylist = [
        '%s.repayment.3_yr_repayment_suppressed.overall',
        '%s.repayment.repayment_cohort.1_year_declining_balance',
        '%s.repayment.1_yr_repayment.completers',
        '%s.repayment.1_yr_repayment.noncompleters',
        '%s.repayment.repayment_cohort.3_year_declining_balance',
        '%s.repayment.3_yr_repayment.completers',
        '%s.repayment.3_yr_repayment.noncompleters',
        '%s.repayment.repayment_cohort.5_year_declining_balance',
        '%s.repayment.5_yr_repayment.completers',
        '%s.repayment.5_yr_repayment.noncompleters',
        '%s.repayment.repayment_cohort.7_year_declining_balance',
        '%s.repayment.7_yr_repayment.completers',
        '%s.repayment.7_yr_repayment.noncompleters']
    fields = ",".join([entry % year for entry in entrylist])
    url = "%s?id=%s&api_key=%s&fields=%s" % (SCHOOLS_ROOT,
                                             school_id,
                                             API_KEY,
                                             fields)
    data = json.loads(requests.get(url).text)['results'][0]
    repay_completers = data['%s.repayment.5_yr_repayment.completers' % year]
    repay_non = data['%s.repayment.5_yr_repayment.noncompleters' % year]
    data['completer_repayment_rate_after_5_yrs'] = calculate_percent(repay_completers,
                                                    repay_non)
    return data
