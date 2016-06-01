import mock
import unittest

from django.core.management.base import CommandError
from django.core.management import call_command

from paying_for_college.management.commands import update_via_api


class CommandTests(unittest.TestCase):
    @mock.patch('paying_for_college.management.commands.update_colleges.update')
    def test_api_update(self, mock_update):
        mock_update.return_value = ([], [], 'OK')
        (f, n, test_run) = call_command('update_via_api')
        self.assertTrue(mock_update.call_count == 1)
        self.assertTrue('OK' in test_run)
        (f2, n2, test_run2) = call_command('update_via_api',
                                           '--single-school 99999')
        self.assertTrue('OK' in test_run2)
        self.assertTrue(mock_update.call_count == 2)
