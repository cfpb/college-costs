from django.conf.urls import url, include
from django.conf import settings
from paying_for_college.views import (LandingView,
                                      BaseTemplateView,
                                      URL_ROOT)
from django.contrib import admin
from django.conf import settings

try:
    STANDALONE = settings.STANDALONE
except AttributeError:  # pragma: no cover
    STANDALONE = False

urlpatterns = [
    url(r'^$',
        LandingView.as_view(), name='pfc-landing'),
    url(r'^understanding-your-financial-aid-offer/',
        include('paying_for_college.disclosures.urls',
                namespace='disclosures')),
    url(r'^repay-student-debt/$',
        BaseTemplateView.as_view(template_name='repay_student_debt.html'),
        name='pfc-repay'),
    url(r'^explore-student-loan-options/$',
        BaseTemplateView.as_view(template_name='choose_a_loan.html'),
        name='pfc-choose'),
    url(r'^choosing-college-bank-accounts/$',
        BaseTemplateView.as_view(template_name='manage_your_money.html'),
        name='pfc-manage'),
    url(r'^know-before-you-owe-student-debt/$',
        BaseTemplateView.as_view(template_name='kbyo-static.html'),
        name='pfc-kbyo'),
    url(r'^student-loan-forgiveness-pledge/$',
        BaseTemplateView.as_view(template_name='pledge-static.html'),
        name='pfc-pledge'),

]

if STANDALONE:
    admin.autodiscover()
    urlpatterns += [
        url(r'^{}/admin/'.format(URL_ROOT), include(admin.site.urls)),
        url(r'^{}/$'.format(URL_ROOT),
            LandingView.as_view(), name='standalone:pfc-landing'),
        url(r'^{}/understanding-your-financial-aid-offer/'.format(URL_ROOT),
            include('paying_for_college.disclosures.urls',
                    namespace='standalone-disclosures')),
        url(r'^{}/repay-student-debt/'.format(URL_ROOT),
            BaseTemplateView.as_view(template_name='repay_student_debt.html'),
            name='standalone-pfc-repay'),
        url(r'^{}/explore-student-loan-options/$'.format(URL_ROOT),
            BaseTemplateView.as_view(template_name='choose_a_loan.html'),
            name='standalone-pfc-choose'),
        url(r'^{}/choosing-college-bank-accounts/$'.format(URL_ROOT),
            BaseTemplateView.as_view(template_name='manage_your_money.html'),
            name='standalone-pfc-manage'),
        url(r'^{}/know-before-you-owe-student-debt/$'.format(URL_ROOT),
            BaseTemplateView.as_view(template_name='kbyo-static.html'),
            name='standalone-pfc-kbyo'),
        url(r'^{}/student-loan-forgiveness-pledge/$'.format(URL_ROOT),
            BaseTemplateView.as_view(template_name='pledge-static.html'),
            name='standalone-pfc-pledge'),
    ]
