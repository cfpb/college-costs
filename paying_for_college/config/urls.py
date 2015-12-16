from django.conf.urls import url, include
from django.conf import settings
from paying_for_college.views import LandingView, BaseTemplateView
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
    url(r'^demo/$',
        BaseTemplateView.as_view(template_name='just-a-demo.html'),
        name='pfc-demo'),
    url(r'^know-before-you-owe-student-debt/$',
        BaseTemplateView.as_view(template_name='kbyo-static.html'),
        name='pfc-kbyo'),
    url(r'^student-loan-forgiveness-pledge/$',
        BaseTemplateView.as_view(template_name='pledge-static.html'),
        name='pfc-pledge'),

]

if STANDALONE:
    urlpatterns += [
    url(r'^paying-for-college2/admin/', include(admin.site.urls)),
    url(r'^paying-for-college2/$',
        LandingView.as_view(), name='standalone:pfc-landing'),
    url(r'^paying-for-college2/understanding-your-financial-aid-offer/',
        include('paying_for_college.disclosures.urls',
                namespace='standalone-disclosures')),
    url(r'^paying-for-college2/repay-student-debt/',
        BaseTemplateView.as_view(template_name='repay_student_debt.html'),
        name='standalone-pfc-repay'),
    url(r'^paying-for-college2/explore-student-loan-options/$',
        BaseTemplateView.as_view(template_name='choose_a_loan.html'),
        name='standalone-pfc-choose'),
    url(r'^paying-for-college2/choosing-college-bank-accounts/$',
        BaseTemplateView.as_view(template_name='manage_your_money.html'),
        name='standalone-pfc-manage'),
    url(r'^paying-for-college2/demo/$',
        BaseTemplateView.as_view(template_name='just-a-demo.html'),
        name='standalone-pfc-demo'),
    url(r'^paying-for-college2/know-before-you-owe-student-debt/$',
        BaseTemplateView.as_view(template_name='kbyo-static.html'),
        name='standalone-pfc-kbyo'),
    url(r'^paying-for-college2/student-loan-forgiveness-pledge/$',
        BaseTemplateView.as_view(template_name='pledge-static.html'),
        name='standalone-pfc-pledge'),
    ]
