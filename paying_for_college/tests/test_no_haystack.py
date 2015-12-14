#!/usr/bin/env python
# -*- coding: utf8 -*-

from unittest import TestCase

from paying_for_college.config.settings import no_haystack


class NoHaystackTest(TestCase):

    def test_settings(self):
        self.assertTrue('haystack' not in no_haystack.INSTALLED_APPS)
