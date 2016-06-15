import django

import mock

from decimal import *

from paying_for_college.models import Program, School
from paying_for_college.disclosures.scripts.load_programs import get_school, read_in_data, clean_number_as_string, clean_string_as_string, clean, load

class TestLoadPrograms(django.test.TestCase):
    fixtures = ['test_program.json']

    def test_get_school_valid(self):
        result_school, result_err = get_school("408039")
        self.assertEqual(result_school, School.objects.first())
        self.assertEqual(result_err, '')

    def test_get_school_invalid(self):
        result_school, result_err = get_school("1")
        self.assertEqual(result_school, '')
        self.assertEqual(result_err, "ERROR: couldn't find school for ID 1")

    def test_clean_number_as_string_normal_string(self):
        result = clean_number_as_string(" Test Data  ")
        self.assertEqual(result, "Test Data")

    def test_clean_number_as_string_empty_string(self):
        result = clean_number_as_string("  ")
        self.assertEqual(result, None)

    def test_clean_number_as_string_blank(self):
        result = clean_number_as_string("  Blank  ")
        self.assertEqual(result, None)

    def test_clean_number_as_string_no_grad(self):
        result = clean_number_as_string("  No Grads ")
        self.assertEqual(result, None)

    def test_clean_number_as_string_no_data(self):
        result = clean_number_as_string("  No Data ")
        self.assertEqual(result, None)

    def test_clean_string_as_string_normal(self):
        result = clean_string_as_string(" Normal Data  ")
        self.assertEqual(result, "Normal Data")

    def test_clean_string_as_string_empty_string(self):
        result = clean_string_as_string("  ")
        self.assertEqual(result, '')

    def test_clean_string_as_string_blank(self):
        result = clean_string_as_string("  Blank  ")
        self.assertEqual(result, '')

    def test_clean_string_as_string_no_grad(self):
        result = clean_string_as_string("  No Grads ")
        self.assertEqual(result, '')

    def test_clean_string_as_string_no_data(self):
        result = clean_string_as_string("  No Data ")
        self.assertEqual(result, '')

    @mock.patch('paying_for_college.disclosures.scripts.load_programs.clean_number_as_string')
    @mock.patch('paying_for_college.disclosures.scripts.load_programs.clean_string_as_string')
    def test_clean(self, mock_string, mock_number):
        mock_number.return_value = 'NUMBER'
        mock_string.return_value = 'STRING'
        input_dict = {u'job_placement_rate': u'80', u'default_rate': u'0.29', 
        u'job_placement_note': '', u'mean_student_loan_completers': 'Blank', 
        u'average_time_to_complete': '', u'accreditor': '', 
        u'total_cost': u'44565', u'ipeds_unit_id': u'139579', u'average_salary': u'45586', 
        u'program_code': u'1509', u'books_supplies': 'No Data', u'campus_name': u'SU Savannah', 
        u'cip_code': u'11.0401', u'ope_id': u'1303900', u'completion_rate': u'0.23', 
        u'program_level': u'2', u'tuition_fees': u'44565', u'program_name': u'Information Technology', 
        u'median_student_loan_completers': u'28852', u'soc_codes': u'11-3021', u'program_length': u'24'}

        expected_dict = {u'job_placement_rate': 'NUMBER', u'default_rate': 'NUMBER', 
        u'job_placement_note': 'STRING', u'mean_student_loan_completers': 'NUMBER', 
        u'average_time_to_complete': 'NUMBER', u'accreditor': 'STRING', 
        u'total_cost': 'NUMBER', u'ipeds_unit_id': 'STRING', u'average_salary': 'NUMBER', 
        u'program_code': 'STRING', u'books_supplies': 'NUMBER', u'campus_name': 'STRING', 
        u'cip_code': 'STRING', u'ope_id': 'STRING', u'completion_rate': 'NUMBER', 
        u'program_level': 'NUMBER', u'tuition_fees': 'NUMBER', u'program_name': 'STRING', 
        u'median_student_loan_completers': 'NUMBER', u'soc_codes': 'STRING', u'program_length': 'NUMBER'}
        result = clean(input_dict)
        self.assertEqual(mock_number.call_count, 12)
        self.assertEqual(mock_string.call_count, 9)
        print(result)
        print(expected_dict)
        self.assertDictEqual(result, expected_dict)

    @mock.patch('paying_for_college.disclosures.scripts.load_programs.read_in_data')
    @mock.patch('paying_for_college.disclosures.scripts.load_programs.clean')
    @mock.patch('paying_for_college.disclosures.scripts.load_programs.Program.objects.get_or_create')
    def test_load(self, mock_program, mock_clean, mock_read_in):
        mock_read_in.return_value = [
            {"ipeds_unit_id": "408039", "ope_id": "", "campus_name": "Ft Wayne - Test", 
                "program_code": "981 - Test", "program_name": "Occupational Therapy Assistant - 981 - Test", 
                "program_level": "4", "program_length": "25", 
                "accreditor": "Accrediting Council for Independent Colleges and Schools (ACICS) - Test", 
                "average_salary": "24000", "average_time_to_complete": "35", "books_supplies": "1000", 
                "completion_rate": "13", "default_rate": "50", "job_placement_rate": "0.20", 
                "job_placement_note": "The rate reflects employment status as of November 1, 2014 - Test", 
                "mean_student_loan_completers": "30000", "median_student_loan_completers": "30500", 
                "total_cost": "50000", "tuition_fees": "40000", "cip_code": "51.0803 - Test", 
                "soc_codes": "31-2011.00 - Test"}
        ]
        mock_clean.return_value = {"ipeds_unit_id": "408039", "ope_id": "", "campus_name": "Ft Wayne - Test", 
                "program_code": "981 - Test", "program_name": "Occupational Therapy Assistant - 981 - Test", 
                "program_level": 4, "program_length": 25, 
                "accreditor": "Accrediting Council for Independent Colleges and Schools (ACICS) - Test", 
                "average_salary": 24000, "average_time_to_complete": 35, "books_supplies": 1000, 
                "completion_rate": Decimal(13), "default_rate": Decimal(50), "job_placement_rate": 0.20, 
                "job_placement_note": "The rate reflects employment status as of November 1, 2014 - Test", 
                "mean_student_loan_completers": 30000, "median_student_loan_completers": 30500, 
                "total_cost": 50000, "tuition_fees": 40000, "cip_code": "51.0803 - Test", 
                "soc_codes": "31-2011.00 - Test"}
        program = Program.objects.first()
        mock_program.return_value = (program, False)

        load("filename")
        self.assertEqual(mock_read_in.call_count, 1)
        self.assertEqual(mock_clean.call_count, 1)
        self.assertEqual(mock_program.call_count, 1)
        self.assertEqual(program.accreditor, "Accrediting Council for Independent Colleges and Schools (ACICS) - Test")
        self.assertEqual(program.cip_code, "51.0803 - Test")
        self.assertEqual(program.completion_rate, u'13.00') # This is converted to unicode probably bc how decimialfield was handled
        self.assertEqual(program.default_rate, u'50.00') # This is converted to unicode probably bc how decimialfield was handled
        self.assertEqual(program.mean_student_loan_completers, 30000)
        self.assertEqual(program.median_student_loan_completers, 30500)
        self.assertEqual(program.program_code, "981 - Test")
        self.assertEqual(program.program_name, "Occupational Therapy Assistant - 981 - Test")
        self.assertEqual(program.program_length, 25)
        self.assertEqual(program.soc_codes, "31-2011.00 - Test")
        self.assertEqual(program.total_cost, 50000)
        self.assertEqual(program.campus, "Ft Wayne - Test")
        self.assertEqual(program.level, 4)
        self.assertEqual(program.time_to_complete, 35)
        self.assertEqual(program.salary, 24000)
        self.assertEqual(program.job_rate, u'0.20') # This is converted to unicode probably bc how decimialfield was handled
        self.assertEqual(program.job_note, "The rate reflects employment status as of November 1, 2014 - Test")
        self.assertEqual(program.tuition, 40000)
        self.assertEqual(program.books, 1000)






