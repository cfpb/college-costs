from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^compare-financial-aid-and-college-cost/$', BuildComparisonView.as_view(), name='worksheet'),
    url(r'^compare-financial-aid-and-college-cost/api/email/$', EmailLink.as_view(), name='email'),

    url(r'^compare-financial-aid-and-college-cost/feedback/$',
        FeedbackView.as_view(),
        name='pfc-feedback'),

    url(r'^compare-financial-aid-and-college-cost/technote/$',
        TemplateView.as_view(template_name="technote.html"),
        name='pfc-technote'),

    url(r'^compare-financial-aid-and-college-cost/api/search-schools.json', school_search_api),
    url(r'^compare-financial-aid-and-college-cost/api/bah-lookup.json', bah_lookup_api),

    url(r'^compare-financial-aid-and-college-cost/api/school/(\d+).json',
        SchoolRepresentation.as_view(),
        name='school-json'),

    url(r'^compare-financial-aid-and-college-cost/api/worksheet/([1-z0-9-]*).json$',
        DataStorageView.as_view(),
        name='worksheet'),

    url(r'^compare-financial-aid-and-college-cost/api/worksheet/$',
        CreateWorksheetView.as_view(),
        name='create_worksheet')
]
