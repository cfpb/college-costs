import datetime

from django.core.management.base import BaseCommand, CommandError
from paying_for_college.disclosures.scripts import update_colleges

COMMAND_HELP = """Updates our School table with values from the Department of \
Education's CollegeScorecard API. The script intentionally runs slowly \
to avoid triggering API rate limits, so allow an hour to run."""
PARSER_HELP = """Optionally specify a single school to update. \
Pass '--single-school' and a school ID to limit updates to one school."""


class Command(BaseCommand):
    help = COMMAND_HELP

    def add_arguments(self, parser):
        parser.add_argument('--single-school',
                            help=PARSER_HELP)

    def handle(self, *args, **options):
        (failed,
         no_data,
         endmsg) = update_colleges.update(options['single-school'])
        self.stdout.write(endmsg)
