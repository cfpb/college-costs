from __future__ import print_function
import os

try:
    from csvkit import CSVKitDictReader as cdr
except:
    from csv import DictReader as cdr
from rest_framework import serializers

from paying_for_college.models import Program, School
from paying_for_college.views import validate_pid

"""
# Program Data Processing Steps

This script was used to process program data from schools.

It takes in a csv file with column labels as described in ProgramSerializer.

To run the script, run from the Django shell as follows:

```
./manage.py shell
from paying_for_college.disclosures.scripts.load_programs import *
load('paying_for_college/data_sources/sample_program_data.csv')
```

"""

NO_DATA_ENTRIES_LOWER = ('', 'blank', 'no grads', 'no data')


class ProgramSerializer(serializers.Serializer):

    ipeds_unit_id = serializers.CharField(max_length=6)  # '210960'
    ope_id = serializers.CharField(max_length=8, allow_blank=True)  # '747000'
    campus_name = serializers.CharField(allow_blank=True)  # 'Ai Pittsburgh'
    program_code = serializers.CharField()  # '44'
    program_name = serializers.CharField(allow_blank=True)  # 'Hotel & Restaurant Management'
    program_level = serializers.IntegerField(allow_null=True)  # 3 @TODO: Should this by Char? Choice?
    program_length = serializers.IntegerField(allow_null=True)  # 24
    accreditor = serializers.CharField(allow_blank=True)  # ''
    median_salary = serializers.IntegerField(allow_null=True)  # 31240
    average_time_to_complete = serializers.IntegerField(allow_null=True)  # 36
    books_supplies = serializers.IntegerField(allow_null=True)  # 2600
    completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2, max_value=100, allow_null=True)  # 0.29
    default_rate = serializers.DecimalField(max_digits=5, decimal_places=2, max_value=100, allow_null=True)  # 0.23
    job_placement_rate = serializers.DecimalField(max_digits=5, decimal_places=2, max_value=100, allow_null=True)  # 0.7
    job_placement_note = serializers.CharField(allow_blank=True)  # 'optional note'
    mean_student_loan_completers = serializers.IntegerField(allow_null=True)  # 34000
    median_student_loan_completers = serializers.IntegerField(allow_null=True)  # 45857
    total_cost = serializers.IntegerField(allow_null=True)  # 91004
    tuition_fees = serializers.IntegerField(allow_null=True)  # 88404
    cip_code = serializers.CharField(allow_blank=True) # '12.0504'
    soc_codes = serializers.CharField(allow_blank=True)  # '35-1011, 35-1012'
    completers = serializers.IntegerField(allow_null=True)
    completion_cohorts = serializers.IntegerField(allow_null=True)


def get_school(iped):
    try:
        school = School.objects.get(school_id=int(iped))
    except:
        return ('', "ERROR: couldn't find school for ID {0}".format(iped))
    else:
        return (school, '')


def read_in_data(filename):
    try:
        with open(filename, 'r') as f:
            reader = cdr(f)
            data = [row for row in reader]
    except:
        return {}
    else:
        return data


def clean_number_as_string(string):
    # This needs to be cleaned up to None, else validation will complain
    clean_str = string.strip()
    return clean_str if clean_str.lower() not in NO_DATA_ENTRIES_LOWER else None


def clean_string_as_string(string):
    clean_str = string.strip()
    return clean_str if clean_str.lower() not in NO_DATA_ENTRIES_LOWER else ''


def clean(data):

    number_fields = ('program_level', 'program_length', 'median_salary',
        'average_time_to_complete', 'books_supplies', 'completion_rate',
        'default_rate', 'job_placement_rate', 'mean_student_loan_completers',
        'median_student_loan_completers', 'total_cost', 'tuition_fees', 
        'completers', 'completion_cohorts')
    # Clean the parameters, make sure no leading or trailing spaces, and clean number with another function
    cleaned_data = dict(map(lambda (k, v):
        (k, clean_number_as_string(v) if k in number_fields else clean_string_as_string(v)), 
        data.iteritems()))

    return cleaned_data


def load(filename):
    new_programs = 0
    updated_programs = 0
    FAILED = []  # failed messages
    raw_data = read_in_data(filename)
    if not raw_data:
        return (["ERROR: could not read data from {0}".format(filename)], "")

    for row in raw_data:
        fixed_data = clean(row)
        serializer = ProgramSerializer(data=fixed_data)

        if serializer.is_valid():
            data = serializer.data
            if not validate_pid(data['program_code']):
                print("ERROR: invalid program code: "
                      "{}".format(data['program_code']))
                continue
            (school, error) = get_school(data['ipeds_unit_id'])
            if error:
                print(error)
                continue

            program, cr = Program.objects.get_or_create(institution=school,
                                                        program_code=data['program_code'])
            if cr:
                new_programs += 1
            else:
                updated_programs += 1

            program.accreditor = data['accreditor']
            program.cip_code = data['cip_code']
            program.completion_rate = data['completion_rate']
            program.default_rate = data['default_rate']
            program.mean_student_loan_completers = data['mean_student_loan_completers']
            program.median_student_loan_completers = data['median_student_loan_completers']
            program.program_code = data['program_code']
            program.program_name = data['program_name']
            program.program_length = data['program_length']
            program.soc_codes = data['soc_codes']
            program.total_cost = data['total_cost']

            program.campus = data['campus_name']
            program.level = data['program_level']
            program.time_to_complete = data['average_time_to_complete']
            program.salary = data['median_salary']
            program.job_rate = data['job_placement_rate']
            program.job_note = data['job_placement_note']
            program.tuition = data['tuition_fees']
            program.books = data['books_supplies']
            program.completers = data['completers']
            program.completion_cohorts = data['completion_cohorts']
            program.save()

        else: # There is error
            for key, error_list in serializer.errors.iteritems():

                fail_msg = 'ERROR on row {}: {}: '.format(raw_data.index(row) + 1, key)
                for e in error_list:
                    fail_msg = '{} {},'.format(fail_msg, e)
                FAILED.append(fail_msg)

    endmsg = ('{} programs created. {} programs updated.'.format(new_programs, updated_programs))

    return (FAILED, endmsg)
