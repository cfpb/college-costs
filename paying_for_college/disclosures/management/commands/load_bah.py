from glob import glob
from json import dumps
import csv

from django.core.management.base import BaseCommand, CommandError

from comparisontool.models import *


class Command(BaseCommand):
    args = '<path>'
    help = 'Load the specified CSV into the BAH database'

    def handle(self, *args, **options):
        for path_spec in args:
            for path in glob(path_spec):
                print "loading %s" % path
                with open(path) as csv_file:
                    reader = csv.DictReader(csv_file)
                    BAHRate.objects.all().delete()
                    for record in reader:
                        new_rate = BAHRate(zip5=record['ZIP'], value=record['BAH'])
                        new_rate.save()
