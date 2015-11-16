import datetime
import unittest

import django
from django.http import HttpResponse
from django.test import Client
from django.core.urlresolvers import reverse
from paying_for_college.views import Feedback
client = Client()


class TestViews(django.test.TestCase):

    def test_landing_view(self):
        response = client.get(reverse('pfc-landing'))
        self.assertTrue('base_template' in response.context_data.keys())

    def test_stand_alone_view(self):
        response = client.get(reverse('debt:pfc-repay'))
        self.assertTrue('base_template' in response.context_data.keys())

    def test_feedback(self):
        response = client.get(reverse('disclosures:pfc-feedback'))
        self.assertTrue(sorted(response.context_data.keys()) ==
                        ['base_template', 'form'])

    def test_comparison(self):
        response = client.get(reverse('disclosures:worksheet'))
        self.assertTrue('base_template' in response.context.keys())
