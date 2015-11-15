#!/usr/bin/env python
# -*- coding: utf8 -*-
import json

from django.test import TestCase
from disclosures.search_indexes import SchoolIndex
from disclosures.models import School


class SchoolIndexTest(TestCase):

    fixtures = ['disclosures/fixtures/test_fixture.json']
    MOCK_INDEX = SchoolIndex()
    mock_obj = School.objects.get(pk=155317)

    def test_index(self):
        self.assertTrue(self.MOCK_INDEX.get_model() == School)
        self.assertTrue(self.MOCK_INDEX.index_queryset().count() ==
                        School.objects.count())
        self.assertTrue('Jayhawks' in
                        self.MOCK_INDEX.prepare_autocomplete(self.mock_obj))
