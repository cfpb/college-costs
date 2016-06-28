#!/usr/bin/env python
# -*- coding: utf8 -*-
import json
import dateutil.parser
import smtplib

import mock
import requests

from django.test import TestCase
from paying_for_college.models import School, Contact, Program, Alias, Nickname
from paying_for_college.models import ConstantCap, ConstantRate, Disclosure
from paying_for_college.models import Notification, print_vals
from paying_for_college.models import get_region


class SchoolRegionTest(TestCase):

    def test_get_region(self):
        school = School(school_id='123456', state='NE')
        self.assertTrue(get_region(school) == 'MW')

    def test_get_region_failure(self):
        school = School(school_id='123456', state='')
        self.assertTrue(get_region(school) == '')


class SchoolModelsTest(TestCase):

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
                                     degrees_predominant=degrees_highest,
                                     city=city,
                                     state=state,
                                     ope6_id=ope6,
                                     ope8_id=ope8)

    def create_alias(self, alias, school):
        return Alias.objects.create(alias=alias,
                                    is_primary=True,
                                    institution=school)

    def create_contact(self):
        return Contact.objects.create(contact='hack@hackey.edu',
                                      name='Hackey Sack',
                                      endpoint=u'endpoint.hackey.edu')

    def create_nickname(self, school):
        return Nickname.objects.create(institution=school,
                                       nickname='Hackers')

    def create_program(self, school):
        return Program.objects.create(institution=school,
                                      program_name='Hacking',
                                      level='3')

    def create_disclosure(self, school):
        return Disclosure.objects.create(institution=school,
                                         name='Regional transferability',
                                         text="Your credits won't transfer")

    def create_notification(self,
                            school,
                            oid='f38283b5b7c939a058889f997949efa566c616c5',
                            time='2016-01-13T20:06:18.913112+00:00'):
        return Notification.objects.create(institution=school,
                                           oid=oid,
                                           timestamp=dateutil.parser.parse(time),
                                           errors='none')

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
        c = self.create_contact()
        self.assertTrue(isinstance(c, Contact))
        self.assertTrue(c.contact in c.__unicode__())
        n = self.create_nickname(s)
        self.assertTrue(isinstance(n, Nickname))
        self.assertTrue(n.nickname in n.__unicode__())
        p = self.create_program(s)
        self.assertTrue(isinstance(p, Program))
        self.assertTrue(p.program_name in p.__unicode__())
        self.assertTrue(p.program_name in p.as_json())
        self.assertTrue('Bachelor' in p.get_level())
        noti = self.create_notification(s)
        self.assertTrue(isinstance(noti, Notification))
        self.assertTrue(noti.oid in noti.__unicode__())
        self.assertTrue(print_vals(s) is None)
        self.assertTrue("Emerald City" in print_vals(s, val_list=True))
        self.assertTrue("Emerald City" in print_vals(s, val_dict=True)['city'])
        self.assertTrue("Emerald City" in print_vals(s, noprint=True))
        self.assertTrue(s.convert_ope6() == '005555')
        self.assertTrue(s.convert_ope8() == '00555500')
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

    @mock.patch('paying_for_college.models.send_mail')
    def test_email_notification(self, mock_mail):
        skul = self.create_school()
        noti = self.create_notification(skul)
        msg = noti.notify_school()
        self.assertTrue('failed' in msg)
        contact = self.create_contact()
        contact.endpoint = ''
        contact.save()
        skul.contact = contact
        skul.save()
        noti2 = self.create_notification(skul)
        msg1 = noti2.notify_school()
        self.assertTrue(mock_mail.call_count == 1)
        self.assertTrue('email' in msg1)
        noti3 = self.create_notification(skul)
        mock_mail.side_effect = smtplib.SMTPException('fail')
        msg = noti3.notify_school()
        self.assertTrue(mock_mail.call_count == 2)

    @mock.patch('paying_for_college.models.requests.post')
    def test_endpoint_notification(self, mock_post):
        skul = self.create_school()
        contact = self.create_contact()
        contact.endpoint = u'fake-api.fakeschool.edu'
        contact.save()
        skul.contact = contact
        skul.save()
        noti = self.create_notification(skul)
        msg = noti.notify_school()
        self.assertTrue(mock_post.call_count == 1)
        self.assertTrue('endpoint' in msg)
        mock_return = mock.Mock()
        mock_return.ok = False
        mock_post.return_value = mock_return
        fail_msg = noti.notify_school()
        # print("notification mock_post.call_count is {0}".format(mock_post.call_count))
        # print("fail msg is {0}\n\n\n".format(fail_msg))
        self.assertTrue('fail' in fail_msg)

    def test_endpoint_notification_blank_contact(self):
        skul = self.create_school()
        contact = self.create_contact()
        contact.contact = ''
        contact.endpoint = ''
        contact.save()
        skul.contact = contact
        skul.save()
        noti = self.create_notification(skul)
        msg = noti.notify_school()
        self.assertTrue('failed' in msg)

    @mock.patch('paying_for_college.models.requests.post')
    def test_notification_request_errors(self, mock_post):
        skul = self.create_school()
        contact = self.create_contact()
        skul.contact = contact
        skul.save()
        noti = self.create_notification(skul)
        mock_post.side_effect = requests.exceptions.ConnectionError
        msg = noti.notify_school()
        self.assertTrue('Error' in msg)
        mock_post.side_effect = requests.exceptions.Timeout
        msg = noti.notify_school()
        self.assertTrue('Error' in msg)
        mock_post.side_effect = requests.exceptions.RequestException
        msg = noti.notify_school()
        self.assertTrue('Error' in msg)
