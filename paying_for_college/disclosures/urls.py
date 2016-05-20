from django.conf.urls import url
from paying_for_college.views import *

urlpatterns = [
    url(r'^$',
        BuildComparisonView.as_view(), name='worksheet'),

    url(r'^offer/$',
        OfferView.as_view(), name='offer'),

    url(r'^api/email/$', EmailLink.as_view(), name='email'),

    url(r'^feedback/$',
        FeedbackView.as_view(),
        name='pfc-feedback'),

    url(r'^about-this-tool/$',
        BaseTemplateView.as_view(template_name="technote.html"),
        name='pfc-technote'),

    url(r'^api/search-schools.json',
        school_search_api,
        name='school_search'),

    url(r'^api/program/([^/]+)/$',
        ProgramRepresentation.as_view(),
        name='program-json'),

    url(r'^api/constants/$',
        ConstantsRepresentation.as_view(),
        name='constants-json'),

    url(r'^api/national-stats/([^/]+)/$',
        StatsRepresentation.as_view(),
        name='national-stats-json'),

    url(r'^api/expenses/$',
        ExpenseRepresentation.as_view(),
        name='expenses-json'),

    url(r'^api/verify/$',
        VerifyView.as_view(),
        name='verify'),

    url(r'^api/school/(\d+)/$',
        SchoolRepresentation.as_view(),
        name='school-json'),
]
