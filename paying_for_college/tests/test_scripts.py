import unittest
import django
import json
import datetime
import string

import mock
from mock import mock_open, patch
import requests
from django.utils import timezone

from paying_for_college.models import School, Notification
from paying_for_college.disclosures.scripts import (api_utils, update_colleges,
                                                    nat_stats, notifications,
                                                    update_ipeds)
from paying_for_college.disclosures.scripts.ping_edmc import (notify_edmc,
                                                              EDMC_DEV,
                                                              OID, ERRORS)
from django.conf import settings

PFC_ROOT = settings.REPOSITORY_ROOT
YEAR = api_utils.LATEST_YEAR
MOCK_YAML = """\
completion_rate:\n\
  min: 0\n\
  max: 1\n\
  median: 0.4379\n\
  average_range: [.3180, .5236]\n
"""


class TestScripts(django.test.TestCase):

    fixtures = ['test_fixture.json']

    mock_dict = {'results':
                 [{'id': 155317,
                   'ope6_id': 5555,
                   'ope8_id': 55500,
                   'enrollment': 10000,
                   'accreditor': "Santa",
                   'url': '',
                   'degrees_predominant': '',
                   'degrees_highest': '',
                   'school.ownership': 2,
                   'school.grad_rate_lt4': 0.25,
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
    no_data_dict = {'results': None}
    mock_dict2 = {'results':
                  [{'id': 123456,
                    'key': 'value'}],
                  'metadata': {'page': 0}
                  }

    def test_icomma(self):
        icomma_test = update_ipeds.icomma(445999)
        self.assertTrue(icomma_test == '445,999')

    def test_fix_zip5(self):
        fixzip3 = update_colleges.fix_zip5('501')
        self.assertTrue(fixzip3 == '00501')
        fixzip4 = update_colleges.fix_zip5('5501')
        self.assertTrue(fixzip4 == '05501')
        testzip5 = update_colleges.fix_zip5('55105')
        self.assertTrue(testzip5 == '55105')

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_colleges.requests.get')
    def test_update_colleges(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.json.return_value = self.mock_dict
        mock_response.ok = True
        mock_requests.return_value = mock_response
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertTrue(len(NO_DATA) == 0)
        self.assertTrue(len(FAILED) == 0)
        self.assertTrue('updated' in endmsg)
        mock_response.json.return_value = self.no_data_dict
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertFalse(len(NO_DATA) == 0)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_colleges.requests.get')
    def test_update_colleges_single_school(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.json.return_value = self.mock_dict
        mock_response.ok = True
        mock_requests.return_value = mock_response
        (FAILED, NODATA, endmsg) = update_colleges.update(single_school=243197)
        self.assertTrue(len(NODATA) == 0)
        self.assertTrue(len(FAILED) == 0)
        self.assertTrue('updated' in endmsg)
        (FAILED, N0DATA, endmsg) = update_colleges.update(exclude_ids=[999999])
        self.assertTrue(len(NODATA) == 0)
        self.assertTrue(len(FAILED) == 0)
        self.assertTrue('updated' in endmsg)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_colleges.requests.get')
    def test_update_colleges_not_OK(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.ok = False
        mock_response.reason = "Testing OK == False"
        mock_response.status_code = 429
        mock_requests.return_value = mock_response
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertTrue('limit' in endmsg)
        mock_response = mock.Mock()
        mock_response.ok = False
        mock_response.reason = "Testing OK == False"
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertFalse(len(FAILED) == 0)
        mock_requests.side_effect = requests.exceptions.ConnectTimeout
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertFalse(len(FAILED) == 0)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_colleges.requests.get')
    def test_update_colleges_bad_responses(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.ok = True
        mock_response.json.return_value = {'results': []}
        (FAILED, NO_DATA, endmsg) = update_colleges.update()
        self.assertTrue('no data' in endmsg)

    def test_write_clean_csv(self):
        m = mock_open()
        with patch("__builtin__.open", m, create=True):
            update_ipeds.write_clean_csv('mockfile.csv',
                                         ['a ', ' b', ' c '],
                                         ['a', 'b', 'c'],
                                         [{'a ': 'd', ' b': 'e', ' c ': 'f'}])
        self.assertTrue(m.call_count == 1)

    def test_read_csv(self):
        m = mock_open(read_data='a , b, c \nd,e,f')
        with patch("__builtin__.open", m, create=True):
            fieldnames, data = update_ipeds.read_csv('mockfile.csv')
        self.assertTrue(m.call_count == 1)
        self.assertTrue(fieldnames == ['a ', ' b', ' c '])
        self.assertTrue(data == [{'a ': 'd', ' b': 'e', ' c ': 'f'}])

    @mock.patch('paying_for_college.disclosures.scripts.update_ipeds.read_csv')
    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.write_clean_csv')
    def test_clean_csv_headings(self, mock_write, mock_read):
        mock_read.return_value = (['UNITID', 'PEO1ISTR'],
                                  {'UNITID': '100654', 'PEO1ISTR': '0'})
        update_ipeds.clean_csv_headings()
        self.assertTrue(mock_read.call_count == 2)
        self.assertTrue(mock_write.call_count == 2)

    def test_unzip_file(self):
        test_zip = ('{}/paying_for_college/data_sources/ipeds/'
                    'test.txt.zip'.format(PFC_ROOT))
        self.assertTrue(update_ipeds.unzip_file(test_zip))

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.requests.get')
    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.unzip_file')
    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.call')
    def test_download_zip_file(self, mock_call, mock_unzip, mock_requests):
        mock_response = mock.Mock()
        mock_response.ok = False
        mock_requests.return_value = mock_response
        down1 = update_ipeds.download_zip_file('fake.zip', '/tmp/fakefile.zip')
        self.assertFalse(down1)
        mock_response2 = mock.MagicMock()
        mock_response2.iter_content(chunk_size=None).return_value = ['a', 'b']
        mock_response2.ok = True
        mock_requests.return_value = mock_response2
        down2 = update_ipeds.download_zip_file('fake.zip', '/tmp/fakefile.zip')
        self.assertTrue(mock_unzip.call_count == 1)
        self.assertTrue(mock_call.call_count == 1)
        self.assertTrue(down2)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.download_zip_file')
    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.clean_csv_headings')
    def test_download_files(self, mock_clean, mock_download_zip):
        mock_download_zip.return_value = True
        update_ipeds.download_files()
        self.assertTrue(mock_download_zip.call_count == 3)
        self.assertTrue(mock_clean.call_count == 1)
        mock_download_zip.return_value = False
        update_ipeds.download_files()
        self.assertTrue(mock_download_zip.call_count == 6)
        self.assertTrue(mock_clean.call_count == 2)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.read_csv')
    def test_process_datafiles(self, mock_read):
        points = update_ipeds.DATA_POINTS
        mock_return_dict = {points[key]: 'x' for key in points}
        mock_return_dict['UNITID'] = '999999'
        mock_return_dict['ROOM'] = '1'
        mock_fieldnames = ['UNITID', 'ROOM'] + points.keys()
        mock_read.return_value = (mock_fieldnames, [mock_return_dict])
        mock_dict = update_ipeds.process_datafiles()
        self.assertTrue(mock_read.call_count == 2)
        self.assertTrue('999999' in mock_dict.keys())

    @mock.patch('paying_for_college.disclosures.scripts.'
                'update_ipeds.process_datafiles')
    def test_load_values(self, mock_process):
        mock_process.return_value = {'999999': {'onCampusAvail': '2'}}
        msg = update_ipeds.load_values()
        self.assertTrue('DRY' in msg)
        self.assertTrue(mock_process.call_count == 1)
        mock_process.return_value = {'243197': {'onCampusAvail': '2'}}
        msg = update_ipeds.load_values()
        self.assertTrue('DRY' in msg)
        self.assertTrue(mock_process.call_count == 2)
        msg = update_ipeds.load_values(dry_run=False)
        self.assertFalse('DRY' in msg)
        self.assertTrue(mock_process.call_count == 3)
        mock_process.return_value = {'243197': {'onCampusAvail': '1'}}
        msg = update_ipeds.load_values()
        self.assertTrue('DRY' in msg)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'notifications.send_mail')
    def test_send_stale_notifications(self, mock_mail):
        msg = notifications.send_stale_notifications()
        self.assertTrue(mock_mail.call_count == 1)
        self.assertTrue('Found' in msg)
        msg = notifications.send_stale_notifications(add_email=['abc@def.com',
                                                                'ghi@jkl.com'])
        self.assertTrue(mock_mail.call_count == 2)
        self.assertTrue('Found' in msg)
        n = Notification.objects.first()
        n.timestamp = timezone.now()
        n.save()
        notifications.send_stale_notifications()
        self.assertTrue(mock_mail.call_count == 2)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'notifications.Notification.notify_school')
    def test_retry_notifications(self, mock_notify):
        day_old = timezone.now() - datetime.timedelta(days=1)
        mock_notify.return_value = 'notified'
        n = Notification.objects.first()
        n.timestamp = timezone.now()
        n.save()
        msg = notifications.retry_notifications()
        self.assertTrue(mock_notify.call_count == 1)
        n.timestamp = n.timestamp - datetime.timedelta(days=4)
        n.save()
        msg = notifications.retry_notifications()
        self.assertTrue('found' in msg)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'ping_edmc.requests.post')
    def test_edmc_ping(self, mock_post):
        mock_return = mock.Mock()
        mock_return.ok = True
        mock_return.reason = 'OK'
        mock_return.status_code = 200
        mock_post.return_value = mock_return
        resp1 = notify_edmc(EDMC_DEV, OID, ERRORS)
        self.assertTrue('OK' in resp1)
        self.assertTrue(mock_post.call_count == 1)
        mock_post.side_effect = requests.exceptions.ConnectTimeout
        resp2 = notify_edmc(EDMC_DEV, OID, ERRORS)
        self.assertTrue('timed' in resp2)
        self.assertTrue(mock_post.call_count == 2)

    def test_calculate_percent(self):
        percent = api_utils.calculate_group_percent(100, 900)
        self.assertTrue(percent == 10.0)
        percent = api_utils.calculate_group_percent(0, 0)
        self.assertTrue(percent == 0)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'api_utils.requests.get')
    def test_get_repayment_data(self, mock_requests):
        mock_response = mock.Mock()
        expected_dict = {'results':
                         [{'2013.repayment.5_yr_repayment.completers': 100,
                          '2013.repayment.5_yr_repayment.noncompleters': 900}]}
        mock_response.json.return_value = expected_dict
        mock_requests.return_value = mock_response
        data = api_utils.get_repayment_data(123456, YEAR)
        self.assertTrue(data['completer_repayment_rate_after_5_yrs'] == 10.0)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'api_utils.requests.get')
    def test_search_by_school_name(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.json.return_value = self.mock_dict2
        mock_requests.return_value = mock_response
        data = api_utils.search_by_school_name('mockname')
        self.assertTrue(data == self.mock_dict2['results'])

    def test_build_field_string(self):
        fstring = api_utils.build_field_string(YEAR)
        self.assertTrue(fstring.startswith('id'))
        self.assertTrue(fstring.endswith('25000'))

    @mock.patch('paying_for_college.disclosures.scripts.'
                'nat_stats.requests.get')
    def test_get_stats_yaml(self, mock_requests):
        mock_response = mock.Mock()
        mock_response.text = MOCK_YAML
        mock_response.ok = True
        mock_requests.return_value = mock_response
        data = nat_stats.get_stats_yaml()
        self.assertTrue(mock_requests.call_count == 1)
        self.assertTrue(data['completion_rate']['max'] == 1)
        mock_response.ok = False
        mock_requests.return_value = mock_response
        data = nat_stats.get_stats_yaml()
        self.assertTrue(mock_requests.call_count == 2)
        self.assertTrue(data == {})
        mock_requests.side_effect = requests.exceptions.ConnectTimeout
        data = nat_stats.get_stats_yaml()
        self.assertTrue(data == {})

    @mock.patch('paying_for_college.disclosures.scripts.'
                'nat_stats.get_stats_yaml')
    def test_update_national_stats_file(self, mock_get_yaml):
        mock_get_yaml.return_value = {}
        update_try = nat_stats.update_national_stats_file()
        self.assertTrue('Could not' in update_try)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'nat_stats.update_national_stats_file')
    def test_get_national_stats(self, mock_update):
        mock_update.return_value = 'OK'
        data = nat_stats.get_national_stats()
        self.assertTrue(mock_update.call_count == 0)
        self.assertTrue(data['completion_rate']['max'] == 1)
        data2 = nat_stats.get_national_stats(update=True)
        self.assertTrue(mock_update.call_count == 1)
        self.assertTrue(data2['completion_rate']['max'] == 1)
        mock_update.return_value = 'Could not'
        data = nat_stats.get_national_stats(update=True)
        self.assertTrue("retention_rate_4" in data)

    def test_get_prepped_stats(self):
        stats = nat_stats.get_prepped_stats()
        self.assertTrue(stats['completionRateMedian'] <= 1)

    def test_get_bls_stats(self):
        stats = nat_stats.get_bls_stats()
        self.assertTrue(stats['Year'] >= 2014)

    @mock.patch('paying_for_college.disclosures.scripts.'
                'nat_stats.BLS_FILE')
    def test_get_bls_stats_failure(self, mock_file):
        mock_file = '/xxx/xxx.json'
        stats = nat_stats.get_bls_stats()
        self.assertTrue(stats == {})
