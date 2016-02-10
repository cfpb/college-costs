"""a work in progress"""
import datetime
from glob import glob
from json import dumps
from subprocess import call
import csv

from django.core.management.base import BaseCommand, CommandError
from paying_for_college.models import *
# from paying_for_college.disclosures.scripts import ipeds, prep_ipeds_csv
from django.conf import settings


DUMP = ['python',
        'manage.py',
        'dumpdata',
        '--indent',
        '4',
        'paying_for_college',
        '>',
        'paying_for_college/fixtures/colleges.json']
# DATA_ROOT = "%s/data/ipeds" % settings.PROJECT_ROOT


class Command(BaseCommand):
    args = '<path>'
    help = 'Load the specified CSV into the schools database'

    def handle(self, *args, **options):
        print('dumping backup fixture before starting ...')
        call(DUMP)
        # print('dump finished; now downloading IPEDS data')
        # ipeds.download_tuition(DATA_ROOT)
        # print('download finished; now prepping csv')
        # csvfile = prep_ipeds_csv()
        # print("prepped {0}".format(csvfile))
        starter = datetime.datetime.now()
        count = 0
        newcount = 0
        newaliascount = 0
        for path_spec in args:
            for path in glob(path_spec):
                print "loading %s" % path
                with open(path) as csv_file:
                    reader = csv.DictReader(csv_file)
                    for record in reader:
                        count += 1
                        if count % 250 == 0:
                            print count  # progress feedback
                        primary_name = record.get("SCHOOL").strip()
                        school_id = int(record['SCHOOL_ID'])
                        city = record.get('CITY')
                        state = record.get('STATE')
                        school, cr = School.objects.get_or_create(pk=school_id)
                        if created:
                            newcount += 1
                        aliases = set()
                        alias_pack = record.get('ALIAS')  # pipe delimited
                        if alias_pack:
                            aliases = aliases.union([ali.strip()
                                                     for ali in
                                                     alias_pack.split('|')])
                        old_aliases = school.alias_set.all()
                        for new_alias in aliases:
                            Alias.objects.get_or_create(alias=new_alias,
                                                        institution=school)
                            if _[1]:
                                newaliascount += 1
                                print 'created new alias %s' % new_alias
                        old_primary = old_aliases.get(is_primary=True)
                        if old_primary.alias != primary_name:
                            print 'new name for %s -- %s?' % (school,
                                                              primary_name)
                        data_json = dumps(record)
                        school.data_json = data_json
                        school.save()
        print "created %s schools and updated %s" % (newcount,
                                                     (count - newcount))
        print "script run time: %s" % (datetime.datetime.now() - starter)
