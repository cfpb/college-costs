from django.conf.urls import url, include
from django.conf import settings
from paying_for_college.views import LandingView
from django.contrib import admin
from django.conf import settings
try:
    STANDALONE = settings.STANDALONE
except AttributeError:  # pragma: no cover
    STANDALONE = False

urlpatterns = [
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$',
        LandingView.as_view(), name='pfc-landing'),
    url(r'^compare-financial-aid-and-college-cost/',
        include('paying_for_college.disclosures.urls',
                namespace='disclosures')),
    url(r'^repay-student-debt/',
        include('paying_for_college.debt.urls', namespace='debt')),
    url(r'^guides/',
        include('paying_for_college.guides.urls', namespace='guides')),
]

if STANDALONE:
    urlpatterns += [
    url(r'^paying-for-college/$',
        LandingView.as_view(), name='standalone:pfc-landing'),
    url(r'^paying-for-college/compare-financial-aid-and-college-cost/',
        include('paying_for_college.disclosures.urls',
                namespace='standalone-disclosures')),
    url(r'^paying-for-college/repay-student-debt/',
        include('paying_for_college.debt.urls', namespace='standalone-debt')),
    url(r'^paying-for-college/guides/',
        include('paying_for_college.guides.urls', namespace='standalone-guides')),

    ]
