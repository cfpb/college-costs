import datetime
import unittest
import json

import mock
import django
from django.test import RequestFactory
from django.http import HttpResponse, HttpRequest
from django.test import Client
from django.core.urlresolvers import reverse
from paying_for_college.models import School, Program
from paying_for_college.search_indexes import SchoolIndex
from paying_for_college.views import (get_school,
                                      validate_oid,
                                      validate_pid,
                                      EXPENSE_FILE,
                                      get_json_file,
                                      get_program,
                                      get_program_length,
                                      Feedback,
                                      EmailLink,
                                      SchoolRepresentation,
                                      school_search_api)

client = Client()


def setup_view(view, request, *args, **kwargs):
    """Mimic as_view() returned callable, return view instance instead."""
    view.request = request
    view.args = args
    view.kwargs = kwargs
    return view


class Validators(unittest.TestCase):
    """check the oid validator"""
    good_oid = '9e0280139f3238cbc9702c7b0d62e5c238a835d0'
    bad_oid = '9e0<script>console.log("hi")</script>5d0'
    short_oid = '9e45a3e7'

    def test_validate_oid(self):
        self.assertFalse(validate_oid(self.bad_oid))
        self.assertFalse(validate_oid(self.short_oid))
        self.assertTrue(validate_oid(self.good_oid))

    def test_validate_pid(self):
        # bad_chars = [';', '<', '>', '{', '}']
        self.assertFalse(validate_pid('490<script>'))
        self.assertFalse(validate_pid('{value}'))
        self.assertFalse(validate_pid('DROP TABLE;'))
        self.assertTrue(validate_pid('108b'))


class TestViews(django.test.TestCase):

    landing_page_views = [
        'pfc-landing',
        'pfc-repay',
        'pfc-choose',
        'pfc-manage',
    ]
    standalone_landing_page_views = [
        'standalone-pfc-landing',
        'standalone-pfc-repay',
        'standalone-pfc-choose',
        'standalone-pfc-manage',
    ]
    POST = HttpRequest()
    POST.POST = {'school_program': '999999',
                 'ba': True,
                 'is_valid': True}
    feedback_post_data = {'csrfmiddlewaretoken': 'abc',
                          'message': 'test'}

    def test_get_json_file(self):
        test_json = get_json_file(EXPENSE_FILE)
        test_data = json.loads(test_json)
        self.assertTrue('Other' in test_data.keys())
        test_json2 = get_json_file('xxx')
        self.assertTrue(test_json2 == '')

    def test_get_program_length(self):
        school = School(school_id=123456, degrees_highest='2')
        program = Program(institution=school, level='2')
        bad_school = School(school_id=999999, degrees_highest='5')
        test1 = get_program_length(program=program, school=school)
        self.assertTrue(test1 == 2)
        test2 = get_program_length(program='', school=school)
        self.assertTrue(test2 == 2)
        test3 = get_program_length(program='', school='')
        self.assertIs(test3, None)
        program.level = '3'
        test4 = get_program_length(program=program, school='')
        self.assertEqual(test4, 4)
        bad_school_test = get_program_length(program='', school=bad_school)
        self.assertIs(bad_school_test, None)

    # def test_landing_page_views(self):
    #     for url_name in self.landing_page_views:
    #         response = client.get(reverse(url_name))
    #         self.assertTrue('base_template' in response.context_data.keys())

    def test_standalone_landing_views(self):
        for url_name in self.standalone_landing_page_views:
            response = client.get(reverse(url_name))
            self.assertTrue('base_template' in response.context_data.keys())

    def test_feedback(self):
        response = client.get(reverse('disclosures:pfc-feedback'))
        self.assertTrue(sorted(response.context_data.keys()) ==
                        ['base_template', 'form', 'url_root'])

    @mock.patch('paying_for_college.views.render_to_response')
    def test_feedback_post(self, mock_render):
        response = client.post(reverse('disclosures:pfc-feedback'),
                               data=self.feedback_post_data)
        self.assertTrue(mock_render.call_count == 1)

    def test_feedback_post_invalid(self):
        response = client.post(reverse('disclosures:pfc-feedback'))
        self.assertTrue(response.status_code == 400)

    # def test_disclosure(self):
    #     response = client.get(reverse('disclosures:worksheet'))
    #     self.assertTrue('base_template' in response.context.keys())
    #     response2 = client.post(reverse('disclosures:worksheet'),
    #                             request=self.POST)
    #     self.assertTrue('GET' in '%s' % response2)

    def test_technote(self):
        response = client.get(reverse('disclosures:pfc-technote'))
        self.assertTrue('base_template' in response.context_data.keys())


# http://www.consumerfinance.gov/paying-for-college/compare-financial-aid-and-college-cost/api/email/
class EmailTest(django.test.TestCase):

    fixtures = ['test_fixture.json']
    factory = RequestFactory()

    url = reverse('disclosures:email')
    post_data = {'id': '00470019-e077-4fc3-9dbb-4a595fe976e6',
                 'email': 'zzzfakezzz@gmail.com'}

    def test_post_data(self):
        """EmailList.post() gathers post form data."""

        request = self.factory.post(self.url)
        view = setup_view(EmailLink(), request, self.post_data)
        resp = view.post(request)
        self.assertTrue('ok' in resp.content)

    @mock.patch('paying_for_college.views.get_template')
    @mock.patch('paying_for_college.views.send_mail')
    def test_email_view(self, mock_send_mail, mock_get_template):
        request = self.factory.post(self.url, data=self.post_data)
        view = EmailLink.as_view()
        response = view(request)
        self.assertTrue(mock_send_mail.call_count == 1)
        self.assertTrue(mock_get_template.call_count == 1)


# understanding-financial-aid-offers/api/search-schools.json?q=Kansas
class SchoolSearchTest(django.test.TestCase):

    fixtures = ['test_fixture.json',
                'test_program.json']

    class ElasticSchool:
        def __init__(self):
            self.text = ''
            self.school_id = 0
            self.city = ''
            self.state = ''
            self.nicknames = ''

    def test_get_school(self):
        """test grabbing a school by ID"""
        closed_school = School(pk=999999, operating=False)
        closed_school.save()
        test1 = get_school('155317')
        self.assertTrue(test1.pk == 155317)
        test2 = get_school('xxx')
        self.assertTrue(test2 is None)
        test3 = get_school('999999')
        self.assertTrue(test3 is None)

    def test_get_program(self):
        """test grabbing a program by school/program_code"""
        school = School.objects.get(school_id=408039)
        test1 = get_program(school, '981')
        self.assertTrue('Occupational' in test1.program_name)
        test2 = get_program(school, 'xxx')
        self.assertTrue(test2 == None)
        test3 = get_program(school, '<program>')
        self.assertTrue(test3 == None)

    @mock.patch('paying_for_college.views.SearchQuerySet.autocomplete')
    def test_school_search_api(self, mock_sqs_autocomplete):
        """school_search_api should return json."""

        mock_school = School.objects.get(pk=155317)
        # mock the search returned value
        elastic_school = self.ElasticSchool()
        elastic_school.text = mock_school.primary_alias
        elastic_school.school_id = mock_school.school_id
        elastic_school.city = mock_school.city
        elastic_school.state = mock_school.state
        elastic_school.nicknames = 'Jayhawks'
        solr_queryset = [elastic_school]
        mock_sqs_autocomplete.return_value = solr_queryset
        url = "%s?q=Kansas" % reverse('disclosures:school_search')
        request = RequestFactory().get(url)
        resp = school_search_api(request)
        self.assertTrue('Kansas' in resp.content)
        self.assertTrue('155317' in resp.content)
        self.assertTrue('Jayhawks' in resp.content)


class OfferTest(django.test.TestCase):

    fixtures = ['test_fixture.json',
                'test_program.json']

    # /paying-for-college/understanding-financial-aid-offers/offer/?[QUERYSTRING]
    def test_offer(self):
        """request for offer disclosure."""

        url = reverse('disclosures:offer')
        url_test = ('disclosures:offer_test')
        qstring = ('?iped=408039&pid=981&'
                   'oid=f38283b5b7c939a058889f997949efa566c616c5&'
                   'tuit=38976&hous=3000&book=650&tran=500&othr=500&'
                   'pelg=1500&schg=2000&stag=2000&othg=100&ta=3000&'
                   'mta=3000&gib=3000&wkst=3000&parl=10000&perl=3000&'
                   'subl=15000&unsl=2000&ppl=1000&gpl=1000&prvl=3000&'
                   'prvi=4.55&insl=3000&insi=4.55')
        no_oid = '?iped=408039&pid=981&oid='
        bad_school = ('?iped=xxxxxx&pid=981&'
                      'oid=f38283b5b7c939a058889f997949efa566c61')
        bad_program = ('?iped=408039&pid=xxx&'
                       'oid=f38283b5b7c939a058889f997949efa566c616c5')
        puerto_rico = '?iped=243197&pid=981&oid='
        missing_oid_field = '?iped=408039&pid=981'
        missing_school_id = '?iped='
        bad_oid = ('?iped=408039&pid=981&oid=f382'
                   '<script></script>f997949efa566c616c5')
        illegal_program = ('?iped=408039&pid=<981>&oid=f38283b'
                           '5b7c939a058889f997949efa566c616c5')
        no_program = ('?iped=408039&pid=&oid=f38283b'
                      '5b7c939a058889f997949efa566c616c5')
        resp = client.get(url+qstring)
        self.assertTrue(resp.status_code == 200)
        resp_test = client.get(url+qstring)
        self.assertTrue(resp_test.status_code == 200)
        resp2 = client.get(url+no_oid)
        self.assertTrue(resp2.status_code == 200)
        self.assertTrue("noOffer" in resp2.context['warning'])
        resp3 = client.get(url+bad_school)
        self.assertTrue("noSchool" in resp3.context['warning'])
        self.assertTrue(resp3.status_code == 200)
        resp4 = client.get(url+bad_program)
        self.assertTrue(resp4.status_code == 200)
        self.assertTrue("noProgram" in resp4.context['warning'])
        resp5 = client.get(url+missing_oid_field)
        self.assertTrue(resp5.status_code == 200)
        self.assertTrue("noOffer" in resp5.context['warning'])
        resp6 = client.get(url+missing_school_id)
        self.assertTrue("noSchool" in resp6.context['warning'])
        self.assertTrue(resp6.status_code == 200)
        resp7 = client.get(url+bad_oid)
        self.assertTrue("noOffer" in resp7.context['warning'])
        self.assertTrue(resp7.status_code == 200)
        resp8 = client.get(url+illegal_program)
        self.assertTrue("noProgram" in resp8.context['warning'])
        self.assertTrue(resp8.status_code == 200)
        resp9 = client.get(url+no_program)
        self.assertTrue("noProgram" in resp9.context['warning'])
        self.assertTrue(resp9.status_code == 200)


class APITests(django.test.TestCase):

    fixtures = ['test_fixture.json',
                'test_constants.json',
                'test_program.json']

    # /paying-for-college/understanding-financial-aid-offers/api/school/155317.json
    def test_school_json(self):
        """api call for school details."""

        url = reverse('disclosures:school-json', args=['155317'])
        resp = client.get(url)
        self.assertTrue('Kansas' in resp.content)
        self.assertTrue('155317' in resp.content)

    # /paying-for-college/understanding-financial-aid-offers/api/constants/
    def test_constants_json(self):
        """api call for constants."""

        url = reverse('disclosures:constants-json')
        resp = client.get(url)
        self.assertTrue('institutionalLoanRate' in resp.content)
        self.assertTrue('apiYear' in resp.content)

    # /paying-for-college/understanding-financial-aid-offers/api/constants/
    def test_national_stats_json(self):
        """api call for national statistics."""

        url = reverse('disclosures:national-stats-json', args=['408039'])
        resp = client.get(url)
        self.assertTrue('retentionRateMedian' in resp.content)
        self.assertTrue(resp.status_code == 200)
        url2 = reverse('disclosures:national-stats-json', args=['000000'])
        resp2 = client.get(url2)
        self.assertTrue('nationalSalary' in resp2.content)
        self.assertTrue(resp2.status_code == 200)

    def test_expense_json(self):
        """api call for BLS expense data"""
        url = reverse('disclosures:expenses-json')
        resp = client.get(url)
        self.assertTrue('Other' in resp.content)

    @mock.patch('paying_for_college.views.get_json_file')
    def test_expense_json_failure(self, mock_get_json):
        """failed api call for BLS expense data"""
        url = reverse('disclosures:expenses-json')
        mock_get_json.return_value = ''
        resp = client.get(url)
        self.assertTrue('No expense' in resp.content)

    # /paying-for-college/understanding-financial-aid-offers/api/program/408039_981/
    def test_program_json(self):
        """api call for program details."""

        url = reverse('disclosures:program-json', args=['408039_981'])
        resp = client.get(url)
        self.assertTrue('housing' in resp.content)
        self.assertTrue('books' in resp.content)
        bad_url = reverse('disclosures:program-json', args=['408039'])
        resp2 = client.get(bad_url)
        self.assertTrue(resp2.status_code == 400)
        self.assertTrue('Error' in resp2.content)
        url3 = reverse('disclosures:program-json', args=['408039_xyz'])
        resp3 = client.get(url3)
        self.assertTrue(resp3.status_code == 400)
        self.assertTrue('Error' in resp3.content)
        url4 = reverse('disclosures:program-json', args=['408039_<script>'])
        resp4 = client.get(url4)
        self.assertTrue(resp4.status_code == 400)
        self.assertTrue('Error' in resp4.content)


class VerifyViewTest(django.test.TestCase):

    fixtures = ['test_fixture.json']
    post_data = {'oid': 'f38283b5b7c939a058889f997949efa566c616c5',
                 'iped': '408039',
                 'errors': 'none'}
    url = reverse('disclosures:verify')

    def test_verify_view(self):
        resp = client.post(self.url, data=self.post_data)
        self.assertTrue(resp.status_code == 200)
        self.assertTrue('Verification' in resp.content)
        resp2 = client.post(self.url, data=self.post_data)
        self.assertTrue(resp2.status_code == 400)
        self.assertTrue('already' in resp2.content)

    def test_verify_view_bad_id(self):
        self.post_data['iped'] = ''
        resp = client.post(self.url, data=self.post_data)
        self.assertTrue(resp.status_code == 400)

    def test_verify_view_bad_oid(self):
        self.post_data['iped'] = '408039'
        self.post_data['oid'] = 'f38283b5b7c939a058889f997949efa566script'
        resp = client.post(self.url, data=self.post_data)
        self.assertTrue(resp.status_code == 400)

    def test_verify_view_no_data(self):
        self.post_data = {}
        resp = client.post(self.url, data=self.post_data)
        self.assertTrue(resp.status_code == 400)
