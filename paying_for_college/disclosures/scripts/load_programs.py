from __future__ import print_function
import os

from csvkit import CSVKitDictReader as cdr
from rest_framework import serializers

from paying_for_college.models import Program, School

"""
# Program Data Processing Steps

This script was used to process program data from schools.

It takes in a csv file with column labels as described in ProgramSerializer.

To run the script, run from the Django shell as follows:

```
./manage.py shell
from paying_for_college.disclosures.scripts.load_programs import *
load_programs('paying_for_college/data_sources/sample_program_data.csv')
```

"""


# SRC_DIR = '/tmp/collegedata/'


# def check_source_directory():
#     """make sure source directory exists"""
#     return os.isdir(SRC_DIR)


class ProgramSerializer(serializers.Serializer):

    ipeds_unit_id = serializers.CharField(max_length=6)  # '210960'
    ope_id = serializers.CharField(max_length=8, allow_blank=True)  # '747000'
    campus_name = serializers.CharField(allow_blank=True)  # 'Ai Pittsburgh'
    program_code = serializers.CharField(allow_blank=True)  # '44'
    program_name = serializers.CharField()  # 'Hotel & Restaurant Management'
    program_level = serializers.IntegerField(allow_null=True)  # 3 @TODO: Should this by Char? Choice?
    program_length = serializers.IntegerField(allow_null=True)  # 24
    accreditor = serializers.CharField(allow_blank=True)  # ''
    average_salary = serializers.IntegerField(allow_null=True)  # 31240
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
    # Currently this is a list possible entries that means no data in a number field
    # This needs to be cleaned up to None, else validation will complain
    no_data_entries = ('', 'No Grads', 'No Data')
    return string if string not in no_data_entries else None


def clean(data):

    number_fields = ('program_level', 'program_length', 'average_salary', 
        'average_time_to_complete', 'books_supplies', 'completion_rate', 
        'default_rate', 'job_placement_rate', 'mean_student_loan_completers',
        'median_student_loan_completers', 'total_cost', 'tuition_fees')
    # Clean the parameters, make sure no leading or trailing spaces, and clean number with another function
    cleaned_data = dict(map(lambda (k, v): 
        (k, v.strip() if k not in number_fields else clean_number_as_string(v.strip())), 
        data.iteritems()))

    # if cleaned_data['accreditor'] in ['Blank']:
    #     cleaned_data['accreditor'] = ''

    return cleaned_data


def load_programs(filename):
    new_programs = 0
    updated_programs = 0
    raw_data = read_in_data(filename)
    if not raw_data:
        return "ERROR: could not read data from {0}".format(filename)

    for row in raw_data:
        fixed_data = clean(row)
        serializer = ProgramSerializer(data=fixed_data)

        print("******** Fixed Row ********")
        print(fixed_data)
        if serializer.is_valid():
            data = serializer.data
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

            print("******** cleaned data *******")
            print(data)
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
            program.salary = data['average_salary']
            program.job_rate = data['job_placement_rate']
            program.job_note = data['job_placement_note']
            program.tuition = data['tuition_fees']
            program.books = data['books_supplies']
            program.save()


        else: # There is error
            for key, error_list in serializer.errors.iteritems():
                print('ERROR: {}: '.format(key))
                for e in error_list:
                    print(e)

    print('{} programs created. {} programs updated.'.format(new_programs, updated_programs))


