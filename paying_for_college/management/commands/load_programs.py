from django.core.management.base import BaseCommand, CommandError
from paying_for_college.disclosures.scripts import load_programs

COMMAND_HELP = """update_programs will update program data based on \
data obtained from schools.  It takes in a path to a file, which \
should be in a csv format with specific fields."""


class Command(BaseCommand):
    help = COMMAND_HELP

    def add_arguments(self, parser):
        parser.add_argument('filename', nargs='+', type=str)

    def handle(self, *args, **options):
        # i.e. filename = 'paying_for_college/data_sources/sample_program_data.csv'
        for filename in options['filename']:

            try:
                (FAILED, endmsg) = load_programs.load(filename)
            except:
                self.stdout.write("Error with script")
            else:
                if FAILED:
                    for fail_msg in FAILED:
                        self.stdout.write(fail_msg)
                self.stdout.write(endmsg)
