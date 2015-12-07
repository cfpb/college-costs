"""
Utilities for querying the Dept of Ed's collegescorecard api

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
import os
import sys
import csv
import json
import datetime
from copy import copy
from decimal import Decimal

import requests

from paying_for_college.models import ConstantCap

try:
    LATEST_YEAR = ConstantCap.objects.get(slug='latest_year').value
except:  # pragma: no cover
    LATEST_YEAR = 2013

try:
    API_KEY = os.getenv('ED_API_KEY')
except:  # pragma: no cover
    API_KEY = '0123456789' * 4
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
    'school.under_investigation': 'under_investigation',
}

JSON_MAP = {
    '%s.student.retention_rate.four_year.full_time' % LATEST_YEAR: 'RETENTRATE',
    '%s.student.retention_rate.lt_four_year.full_time' % LATEST_YEAR: 'RETENTRATELT4',  # NEW
    '%s.repayment.repayment_cohort.3_year_declining_balance' % LATEST_YEAR: 'REPAY3YR',  # NEW
    '%s.repayment.3_yr_default_rate' % LATEST_YEAR: 'DEFAULTRATE',
    '%s.aid.median_debt_suppressed.overall' % LATEST_YEAR: 'AVGSTULOANDEBT',
    '%s.aid.median_debt_suppressed.completers.monthly_payments' % LATEST_YEAR: 'MEDIANDEBTCOMPLETER',  # NEW
}

BASE_FIELDS = [
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

YEAR_FIELDS = [
    'cost.attendance.academic_year',
    'cost.attendance.program_year',
    'cost.tuition.in_state',
    'cost.tuition.out_of_state',
    'cost.tuition.program_year',
    'student.fafsa_sent.2_college_allyrs',
    'student.fafsa_sent.3_college_allyrs',
    'student.fafsa_sent.4_college_allyrs',
    'student.fafsa_sent.5plus_college_allyrs',
    'student.fafsa_sent.overall',
    'student.fafsa_sent.1_college',
    'student.fafsa_sent.2_colleges',
    'student.fafsa_sent.3_college',  # yes, should be 'colleges'
    'student.fafsa_sent.4_colleges',
    'student.fafsa_sent.5_or_more_colleges',
    'student.fafsa_sent.2_college_allyrs',
    'student.fafsa_sent.3_college_allyrs',
    'student.fafsa_sent.4_college_allyrs',
    'student.fafsa_sent.5plus_college_allyrs',
    'student.size',
    'student.enrollment.all',  # blank for many schools
    'admissions.admission_rate.overall',
    'admissions.admission_rate.by_ope_id',
    'student.retention_rate.four_year.full_time',
    'student.retention_rate.lt_four_year.full_time',
    'student.retention_rate.four_year.part_time',
    'student.retention_rate.lt_four_year.part_time',
    'student.demographics.veteran',  # blank for many schools
    'aid.federal_loan_rate',
    'aid.cumulative_debt.number',
    'aid.cumulative_debt.90th_percentile',
    'aid.cumulative_debt.75th_percentile',
    'aid.cumulative_debt.25th_percentile',
    'aid.cumulative_debt.10th_percentile',
    'aid.median_debt_suppressed.overall',
    'aid.median_debt_suppressed.completers.overall',
    'aid.median_debt_suppressed.completers.monthly_payments',
    'aid.students_with_any_loan',
    'repayment.3_yr_repayment_suppressed.overall',
    'repayment.repayment_cohort.1_year_declining_balance',
    'repayment.1_yr_repayment.completers',
    'repayment.1_yr_repayment.noncompleters',
    'repayment.repayment_cohort.3_year_declining_balance',
    'repayment.3_yr_repayment.completers',
    'repayment.3_yr_repayment.noncompleters',
    'repayment.repayment_cohort.5_year_declining_balance',
    'repayment.5_yr_repayment.completers',
    'repayment.5_yr_repayment.noncompleters',
    'repayment.repayment_cohort.7_year_declining_balance',
    'repayment.7_yr_repayment.completers',
    'repayment.7_yr_repayment.noncompleters',
    'earnings.6_yrs_after_entry.working_not_enrolled.mean_earnings',
    'earnings.6_yrs_after_entry.median',
    'earnings.6_yrs_after_entry.percent_greater_than_25000',
    'earnings.7_yrs_after_entry.mean_earnings',
    'earnings.7_yrs_after_entry.percent_greater_than_25000',
    'earnings.8_yrs_after_entry.mean_earnings',
    'earnings.8_yrs_after_entry.median_earnings',
    'earnings.8_yrs_after_entry.percent_greater_than_25000',
    'earnings.9_yrs_after_entry.mean_earnings',
    'earnings.9_yrs_after_entry.percent_greater_than_25000',
    'earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings',
    'earnings.10_yrs_after_entry.median',
    'earnings.10_yrs_after_entry.percent_greater_than_25000'
]


def build_field_string(YEAR=LATEST_YEAR):
    """assemble fields for an api query for an analysis csv"""
    fields = BASE_FIELDS + ['%s.%s' % (YEAR, field) for field in YEAR_FIELDS]
    field_string = ",".join([field for field in fields])
    return field_string


# def get_schools_by_page(year, page=0):
#     """get a page of schools for a single year as dict"""
#     field_string = build_fields_string(year)
#     url = "%s?api_key=%s&page=%s&per_page=%s&fields=%s" % (SCHOOLS_ROOT,
#                                                            API_KEY,
#                                                            page,
#                                                            PAGE_MAX,
#                                                            field_string)
#     data = json.loads(requests.get(url).text)
#     return data


def search_by_school_name(name):
    """search api by school name, return school name, id, city, state"""
    fields = "id,school.name,school.city,school.state"
    url = "%s?api_key=%s&school.name=%s&fields=%s" % (SCHOOLS_ROOT,
                                                      API_KEY,
                                                      name,
                                                      fields)
    data = requests.get(url).json()['results']
    return data


# def get_all_school_ids():
#     """traverse pages, assemble all school ids and names and output as json."""
#     collector = {}
#     url = '%s?api_key=%s&fields=id,school.name' % (SCHOOLS_ROOT, API_KEY)
#     for page in range(1, 391):
#         next_url = "%s&page=%s" % (url, page)
#         nextdata = json.loads(requests.get(next_url).text)
#         for entry in nextdata['results']:
#             collector[entry['id']] = entry['school.name']
#     with open('school_ids.json', 'w') as f:
#         f.write(json.dumps(collector))


def export_spreadsheet(year):
    """traverse pages to build and export an analysis csv for a given year"""
    starter = datetime.datetime.now()
    fields = build_field_string(year)
    headings = fields.replace('.', '_').split(',')
    collector = {}
    container = {}
    for key in headings:
        container[key] = ''
    url = '%s?api_key=%s&per_page=%s&fields=%s' % (SCHOOLS_ROOT,
                                                   API_KEY,
                                                   PAGE_MAX,
                                                   fields)
    data = requests.get(url).json()
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
        try:
            nextdata = json.loads(requests.get(next_url).text)
        except:
            nextdata = {'results': []}
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
        writer = csv.writer(f)
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


# def unpack_alias(alist, school):
#     "create alias objects from a list of aliases"
#     for alias in alist:
#         new, created = Alias.objects.get_or_create(alias=alias,
#                                                    institution=school,
#                                                    defaults={'is_primary':
#                                                              False})
#     #example from Penn's alias string
#     ALIST = [
#         'Penn',
#         'U of PA',
#         'U-Penn',
#         'U of P',
#         'Pennsylvania',
#         'UPenn',
#         'Pennsylvania University',
#         'Wharton',
#         'Wharton School of Business']


def calculate_group_percent(group1, group2):
    """calculates one group's percentage of a two-group total"""
    if group1 + group2 == 0:
        return 0
    else:
        return round(group1 * 100.0 / (group1 + group2), 2)


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
    data = requests.get(url).json()['results'][0]
    repay_completers = data['%s.repayment.5_yr_repayment.completers' % year]
    repay_non = data['%s.repayment.5_yr_repayment.noncompleters' % year]
    data['completer_repayment_rate_after_5_yrs'] = calculate_group_percent(repay_completers, repay_non)
    return data
