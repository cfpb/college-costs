#!/usr/bin/env python
# -*- coding: utf8 -*-

from unittest import TestCase


class NoHaystackTest(TestCase):

    def test_settings(self):
        from paying_for_college.config.settings import no_haystack
        self.assertTrue('haystack' not in no_haystack.INSTALLED_APPS)
