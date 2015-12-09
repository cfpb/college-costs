import datetime
import unittest
import json

import mock
import django
from django.test import RequestFactory
from django.http import HttpResponse, HttpRequest
from django.test import Client
from django.core.urlresolvers import reverse
from paying_for_college.views import Feedback, EmailLink, school_search_api
from paying_for_college.views import SchoolRepresentation
from paying_for_college.models import School
from paying_for_college.search_indexes import SchoolIndex

client = Client()


def setup_view(view, request, *args, **kwargs):
    """Mimic as_view() returned callable, return view instance instead."""
    view.request = request
    view.args = args
    view.kwargs = kwargs
    return view


class TestViews(django.test.TestCase):

    landing_page_views = [
        'pfc-landing',
        'pfc-repay',
        'pfc-choose',
        'pfc-manage',
        'pfc-demo',
    ]
    POST = HttpRequest()
    POST.POST = {'school-program': '999999',
                 'ba': True,
                 'is_valid': True}
    feedback_post_data = {'csrfmiddlewaretoken': 'abc',
                          'message': 'test'}
    # '0InrCI5HGbiBEJ1esg6IBi3ax42fwPnL'

    def test_landing_page_views(self):
        for url_name in self.landing_page_views:
            response = client.get(reverse(url_name))
            self.assertTrue('base_template' in response.context_data.keys())

    def test_feedback(self):
        response = client.get(reverse('disclosures:pfc-feedback'))
        self.assertTrue(sorted(response.context_data.keys()) ==
                        ['base_template', 'form'])

    @mock.patch('paying_for_college.views.render_to_response')
    def test_feedback_post(self, mock_render):
        response = client.post(reverse('disclosures:pfc-feedback'),
                               data=self.feedback_post_data)
        self.assertTrue(mock_render.call_count == 1)

    def test_feedback_post_invalid(self):
        response = client.post(reverse('disclosures:pfc-feedback'))
        self.assertTrue(response.status_code == 400)

    def test_disclosure(self):
        response = client.get(reverse('disclosures:worksheet'))
        self.assertTrue('base_template' in response.context.keys())
        response2 = client.post(reverse('disclosures:worksheet'),
                                request=self.POST)
        self.assertTrue('GET' in '%s' % response2)

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

    fixtures = ['test_fixture.json']

    class SolrSchool:
        def __init__(self):
            self.text = ''
            self.school_id = 0
            self.city = ''
            self.state = ''

    @mock.patch('paying_for_college.views.SearchQuerySet.autocomplete')
    def test_school_search_api(self, mock_sqs_autocomplete):
        """school_search_api should return json."""

        mock_school = School.objects.get(pk=155317)
        # mock the solr returned value
        solr_school = self.SolrSchool()
        solr_school.text = mock_school.primary_alias
        solr_school.school_id = mock_school.school_id
        solr_school.city = mock_school.city
        solr_school.state = mock_school.state
        solr_queryset = [solr_school]
        mock_sqs_autocomplete.return_value = solr_queryset
        url = "%s?q=Kansas" % reverse('disclosures:school_search')
        request = RequestFactory().get(url)
        resp = school_search_api(request)
        self.assertTrue('Kansas' in resp.content)
        self.assertTrue('155317' in resp.content)


# /paying-for-college/understanding-financial-aid-offers/api/school/155317.json
class SchoolJsonTest(django.test.TestCase):

    fixtures = ['test_fixture.json']

    def test_school_json(self):
        """api call for school details."""

        url = reverse('disclosures:school-json', args=['155317'])
        resp = client.get(url)
        self.assertTrue('Kansas' in resp.content)
        self.assertTrue('155317' in resp.content)


# NO-DATA WORKSHEET POST
# /paying-for-college/understanding-financial-aid-offers/api/worksheet/
class CreateWorksheetTest(django.test.TestCase):

    fixtures = ['test_fixture.json']

    def test_create_worksheet(self):
        """generating a worksheet ID via api."""

        url = reverse('disclosures:create_worksheet')
        resp = client.post(url)
        self.assertTrue('id' in resp.content)
        data = json.loads(resp.content)
        self.assertTrue(len(data['id']) == 36)

# SAVE POST
# /paying-for-college/understanding-financial-aid-offers/api/worksheet/00470019-e077-4fc3-9dbb-4a595fe976e6.json
    def test_save_worksheet(self):
        """retrieving a creating worksheet via api."""

        url = reverse('disclosures:api-worksheet',
                      args=['00470019-e077-4fc3-9dbb-4a595fe976e6'])
        resp = client.post(url)
        self.assertTrue(resp.status_code == 200)
