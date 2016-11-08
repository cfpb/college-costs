#!/usr/bin/env python
# -*- coding: utf8 -*-
from paying_for_college.models import School
from paying_for_college.search_indexes import SchoolIndex

from django.test import TestCase


class SchoolIndexTest(TestCase):
    fixtures = ['test_fixture.json']
    MOCK_INDEX = SchoolIndex()

    def test_index(self):
        self.assertTrue(self.MOCK_INDEX.get_model() == School)
        self.assertTrue(self.MOCK_INDEX.index_queryset().count() ==
                        School.objects.count())

        mock_obj = School.objects.get(pk=155317)
        self.assertTrue(
            'Jayhawks' in self.MOCK_INDEX.prepare_autocomplete(mock_obj)
        )
