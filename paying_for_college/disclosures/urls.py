from django.conf.urls import url
from paying_for_college.views import *

urlpatterns = [
    url(r'^$', BuildComparisonView.as_view(), name='worksheet'),
    url(r'^api/email/$', EmailLink.as_view(), name='email'),

    url(r'^feedback/$',
        FeedbackView.as_view(),
        name='pfc-feedback'),

    url(r'^technote/$',
        BaseTemplateView.as_view(template_name="technote.html"),
        name='pfc-technote'),

    url(r'^api/search-schools.json',
        school_search_api,
        name='school_search'),

    url(r'^api/bah-lookup.json', bah_lookup_api),

    url(r'^api/school/(\d+).json',
        SchoolRepresentation.as_view(),
        name='school-json'),

    url(r'^api/worksheet/([1-z0-9-]*).json$',
        DataStorageView.as_view(),
        name='api-worksheet'),

    url(r'^api/worksheet/$',
        CreateWorksheetView.as_view(),
        name='create_worksheet')
]
