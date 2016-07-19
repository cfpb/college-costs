import datetime

from django.core.management.base import BaseCommand, CommandError
from paying_for_college.disclosures.scripts.purge_objects import purge

COMMAND_HELP = ("Purge will wipe out all notifications or programs "
                "in the local Django database. "
                "It can't be run against any other models, "
                "and you must provide an object type to purge. "
                "Use it by running 'manage.py purge notifications' "
                "or 'manage.py purge projects'")


class Command(BaseCommand):
    help = COMMAND_HELP

    def add_arguments(self, parser):
        parser.add_argument('objects',
                            type=str)

    def handle(self, *args, **options):
        msg = purge(options['objects'])
        self.stdout.write(msg)
