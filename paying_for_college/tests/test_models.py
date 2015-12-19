#!/usr/bin/env python
# -*- coding: utf8 -*-
import json

from django.test import TestCase
from paying_for_college.models import School, Contact, Program, Alias, Nickname
from paying_for_college.models import ConstantCap, ConstantRate, Disclosure
from paying_for_college.models import print_vals


class SchoolAliasTest(TestCase):

    def create_school(self, ID=999999,
                      data_json='',
                      accreditor="Almighty Wizard",
                      city="Emerald City",
                      degrees_highest="3",
                      state="OZ",
                      ope6=5555,
                      ope8=555500):
        return School.objects.create(school_id=ID,
                                     data_json=data_json,
                                     accreditor=accreditor,
                                     degrees_highest=degrees_highest,
                                     city=city,
                                     state=state,
                                     ope6_id=ope6,
                                     ope8_id=ope8)

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
                                      program_name='Hacking',
                                      level='5')

    def create_disclosure(self, school):
        return Disclosure.objects.create(institution=school,
                                         name='Regional transferability',
                                         text="Your credits won't transfer")

    def test_school_related_models(self):
        s = self.create_school()
        self.assertTrue(isinstance(s, School))
        self.assertEqual(s.primary_alias, "Not Available")
        d = self.create_disclosure(s)
        self.assertTrue(isinstance(d, Disclosure))
        self.assertTrue(d.name in d.__unicode__())
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
        self.assertTrue(p.program_name in p.dump_json())
        self.assertTrue('Bachelor' in p.get_level())
        self.assertTrue(print_vals(s) is None)
        self.assertTrue("Emerald City" in print_vals(s, val_list=True))
        self.assertTrue("Emerald City" in print_vals(s, val_dict=True)['city'])
        self.assertTrue("Emerald City" in print_vals(s, noprint=True))
        self.assertTrue(s.convert_ope6() == '005555')
        self.assertTrue(s.convert_ope8() == '00555500')
        # print("school.degrees_highest is '{0}'".format(s.degrees_highest))
        # print("school.get_highest_degree returns '{0}'".format(s.get_highest_degree()))
        self.assertTrue('Bachelor' in s.get_highest_degree())
        s.ope6_id = 555555
        s.ope8_id = 55555500
        self.assertTrue(s.convert_ope6() == '555555')
        self.assertTrue(s.convert_ope8() == '55555500')
        s.ope6_id = None
        s.ope8_id = None
        self.assertTrue(s.convert_ope6() == '')
        self.assertTrue(s.convert_ope8() == '')

    def test_constant_models(self):
        cr = ConstantRate(name='cr test', slug='crTest', value='0.1')
        self.assertTrue(cr.__unicode__() == u'cr test (crTest), updated None')
        cc = ConstantCap(name='cc test', slug='ccTest', value='0')
        self.assertTrue(cc.__unicode__() == u'cc test (ccTest), updated None')
