import unittest
import django
import json

import mock
from paying_for_college.disclosures.scripts import api_utils, update_colleges
YEAR = api_utils.LATEST_YEAR


class TestUpdater(django.test.TestCase):

    fixtures = ['test_fixture.json']

    mock_dict = {'results':
                 [{'id': 155317,
                   'ope6_id': 'ope6_id',
                   'ope8_id': 'ope8_id',
                   'enrollment': 10000,
                   'accreditor': "Santa",
                   'url': '',
                   'degrees_predominant': '',
                   'degrees_highest': '',
                   'ownership': '',
                   'main_campus': True,
                   'online_only': False,
                   'operating': True,
                   'under_investigation': False,
                   'RETENTRATE': '',
                   'RETENTRATELT4': '',  # NEW
                   'REPAY3YR': '',  # NEW
                   'DEFAULTRATE': '',
                   'AVGSTULOANDEBT': '',
                   'MEDIANDEBTCOMPLETER': '',  # NEW
                   'city': 'Lawrence'}],
                 'metadata': {'page': 0}
                 }

    @mock.patch('paying_for_college.disclosures.scripts.api_utils.requests.get')
    def test_update_colleges(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.json.return_value = self.mock_dict
        mock_response.ok.return_value = True
        mock_requests.return_value = mock_response
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertTrue(len(NO_DATA) == 0)
        self.assertTrue('checked' in endmsg)


class TestScripts(unittest.TestCase):

    mock_dict = {'results':
                 [{'id': 123456,
                   'key': 'value'}],
                 'metadata': {'page': 0}
                 }

    def test_calculate_percent(self):
        percent = api_utils.calculate_group_percent(100, 900)
        self.assertTrue(percent == 10.0)
        percent = api_utils.calculate_group_percent(0, 0)
        self.assertTrue(percent == 0)

    @mock.patch('paying_for_college.disclosures.scripts.api_utils.requests.get')
    def test_get_repayment_data(self, mock_requests):
        mock_response = mock.Mock()
        expected_dict = {'results':
                         [{'2013.repayment.5_yr_repayment.completers': 100,
                          '2013.repayment.5_yr_repayment.noncompleters': 900}]}
        mock_response.json.return_value = expected_dict
        mock_requests.return_value = mock_response
        data = api_utils.get_repayment_data(123456, YEAR)
        self.assertTrue(data['completer_repayment_rate_after_5_yrs'] == 10.0)

    @mock.patch('paying_for_college.disclosures.scripts.api_utils.requests.get')
    def test_export_spreadsheet_no_data(self, mock_requests):
        mock_response = mock.Mock()
        expected_dict = {}
        mock_response.json.return_value = expected_dict
        mock_requests.return_value = mock_response
        data = api_utils.export_spreadsheet(YEAR)
        self.assertTrue(data == expected_dict)

    @mock.patch('paying_for_college.disclosures.scripts.api_utils.requests.get')
    def test_search_by_school_name(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.json.return_value = self.mock_dict
        mock_requests.return_value = mock_response
        data = api_utils.search_by_school_name('mockname')
        self.assertTrue(data == self.mock_dict['results'])

    @mock.patch('paying_for_college.disclosures.scripts.api_utils.requests.get')
    def test_export_spreadsheet(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.text.return_value = json.dumps({'results': []})
        mock_response.json.return_value = self.mock_dict
        mock_requests.return_value = mock_response
        data = api_utils.export_spreadsheet(YEAR)
        self.assertTrue(data == self.mock_dict)

    def test_build_field_string(self):
        fstring = api_utils.build_field_string(YEAR)
        self.assertTrue(fstring.startswith('id'))
        self.assertTrue(fstring.endswith('25000'))
