import mock
import unittest

from django.core.management.base import CommandError
from django.core.management import call_command

from paying_for_college.management.commands import (update_ipeds,
                                                    update_via_api,
                                                    load_programs,
                                                    retry_notifications,
                                                    send_stale_notifications)


class CommandTests(unittest.TestCase):

    @mock.patch('paying_for_college.management.commands.'
                'update_ipeds.load_values')
    def test_update_ipeds(self, mock_load):
        mock_load.return_value = 'DRY RUN'
        call_command('update_ipeds')
        self.assertEqual(mock_load.call_count, 1)
        call_command('update_ipeds', '--dry-run', 'false')
        self.assertEqual(mock_load.call_count, 2)
        call_command('update_ipeds', '--dry-run', 'jabberwocky')
        self.assertEqual(mock_load.call_count, 2)

    @mock.patch('paying_for_college.management.commands.'
                'update_via_api.update_colleges.update')
    def test_api_update(self, mock_update):
        mock_update.return_value = ([], [], 'OK')
        call_command('update_via_api')
        self.assertTrue(mock_update.call_count == 1)
        call_command('update_via_api', '--school_id', '99999')
        self.assertTrue(mock_update.call_count == 2)
        mock_update.side_effect = IndexError("no such school ID")
        call_command('update_via_api', '--school_id', '99999')
        self.assertTrue(mock_update.call_count == 3)

    @mock.patch('paying_for_college.management.commands.'
                'load_programs.load_programs.load')
    def test_load_programs(self, mock_load):
        mock_load.return_value = ([], 'OK')
        call_command('load_programs', 'filename')
        self.assertEqual(mock_load.call_count, 1)
        mock_load.assert_called_once_with('filename')
        mock_load.return_value = (['failure'], 'not OK')
        call_command('load_programs', 'filename')
        self.assertEqual(mock_load.call_count, 2)
        mock_error = mock.Mock()
        mock_error.side_effect = Exception('Mock Error!')
        mock_load.return_value = mock_error
        error_state = call_command('load_programs', 'filename')
        self.assertTrue(error_state is None)

    @mock.patch('paying_for_college.management.commands.'
                'load_programs.load_programs.load')
    def test_load_programs_more_than_1_files(self, mock_load):
        mock_load.return_value = ([], 'OK')
        call_command('load_programs', 'filename', 'filename2', 'filename3')
        self.assertEqual(mock_load.call_count, 3)
        mock_load.assert_has_calls([mock.call('filename'),
                                   mock.call('filename2'),
                                   mock.call('filename3')])

    @mock.patch('paying_for_college.management.commands.'
                'retry_notifications.retry_notifications')
    def test_retry_notifications(self, mock_retry):
        mock_retry.return_value = 'notified'
        call_command('retry_notifications')
        self.assertEqual(mock_retry.call_count, 1)
        call_command('retry_notifications', '--days', '2')
        self.assertEqual(mock_retry.call_count, 2)
        self.assertTrue(mock_retry.called_with(days=2))

    @mock.patch('paying_for_college.management.commands.'
                'send_stale_notifications.send_stale_notifications')
    def test_send_stale_notifications(self, mock_send):
        mock_send.return_value = 'notified'
        call_command('send_stale_notifications')
        self.assertEqual(mock_send.call_count, 1)
        call_command('send_stale_notifications',
                     '--add-email', 'fake@fake.com')
        self.assertEqual(mock_send.call_count, 2)
        self.assertTrue(mock_send.called_with(add_email=['fake@fake.com']))
