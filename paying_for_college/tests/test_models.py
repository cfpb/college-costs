#!/usr/bin/env python
# -*- coding: utf8 -*-
import json

from django.test import TestCase
from paying_for_college.models import School, Contact, Program, Alias, Nickname
from paying_for_college.models import ConstantCap, ConstantRate
from paying_for_college.models import print_vals


class SchoolAliasTest(TestCase):

    def create_school(self, ID=999999,
                      data_json='',
                      accreditor="Almighty Wizard",
                      city="Emerald City",
                      state="OZ"):
        return School.objects.create(school_id=ID,
                                     data_json=data_json,
                                     accreditor=accreditor,
                                     city=city,
                                     state=state)

    def create_alias(self, alias, school):
        return Alias.objects.create(alias=alias,
                                    is_primary=True,
                                    institution=school)

    def create_contact(self, school):
        return Contact.objects.create(institution=school,
                                      contact='hackey@school.edu',
                                      name='Hackey Sack')

    def create_nickname(self, school):
        return Nickname.objects.create(institution=school,
                                       nickname='Hackers')

    def create_program(self, school):
        return Program.objects.create(institution=school,
                                       program_name='Hacking')

    def test_school_alias_creation(self):
        s = self.create_school()
        self.assertTrue(isinstance(s, School))
        self.assertEqual(s.primary_alias, "Not Available")
        a = self.create_alias('Wizard U', s)
        self.assertTrue(isinstance(a, Alias))
        self.assertTrue(a.alias in a.__unicode__())
        self.assertEqual(s.primary_alias, a.alias)
        self.assertEqual(s.__unicode__(), a.alias + u" (%s)" % s.school_id)
        c = self.create_contact(s)
        self.assertTrue(isinstance(c, Contact))
        self.assertTrue(c.contact in c.__unicode__())
        self.assertTrue(s.primary_alias in c.__unicode__())
        n = self.create_nickname(s)
        self.assertTrue(isinstance(n, Nickname))
        self.assertTrue(n.nickname in n.__unicode__())
        p = self.create_program(s)
        self.assertTrue(isinstance(p, Program))
        self.assertTrue(p.program_name in p.__unicode__())
        self.assertTrue(print_vals(s) is None)
        self.assertTrue("Emerald City" in print_vals(s, val_list=True))
        self.assertTrue("Emerald City" in print_vals(s, val_dict=True)['city'])
        self.assertTrue("Emerald City" in print_vals(s, noprint=True))

    def test_constant_models(self):
        cr = ConstantRate(name='cr test', slug='crTest', value='0.1')
        self.assertTrue(cr.__unicode__() == u'cr test (crTest), updated None')
        cc = ConstantCap(name='cc test', slug='ccTest', value='0')
        self.assertTrue(cc.__unicode__() == u'cc test (ccTest), updated None')
