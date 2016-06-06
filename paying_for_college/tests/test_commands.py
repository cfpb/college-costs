import mock
import unittest

from django.core.management.base import CommandError
from django.core.management import call_command

from paying_for_college.management.commands import update_via_api


class CommandTests(unittest.TestCase):
    @mock.patch('paying_for_college.management.commands.update_via_api.update_colleges.update')
    def test_api_update(self, mock_update):
        mock_update.return_value = ([], [], 'OK')
        call_command('update_via_api')
        self.assertTrue(mock_update.call_count == 1)
        call_command('update_via_api', '--school_id', '99999')
        self.assertTrue(mock_update.call_count == 2)
