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
    url(r'^understanding-financial-aid-offers/',
        include('paying_for_college.disclosures.urls',
                namespace='disclosures')),
    url(r'^repaying-student-debt/$',
        BaseTemplateView.as_view(template_name='repay_student_debt.html'),
        name='pfc-repay'),
    url(r'^choosing-a-student-loan/$',
        BaseTemplateView.as_view(template_name='choose_a_loan.html'),
        name='pfc-choose'),
    url(r'^managing-college-money/$',
        BaseTemplateView.as_view(template_name='manage_your_money.html'),
        name='pfc-manage'),
    url(r'^demo/$',
        BaseTemplateView.as_view(template_name='just-a-demo.html'),
        name='pfc-demo'),
]

if STANDALONE:
    urlpatterns += [
    url(r'^paying-for-college/admin/', include(admin.site.urls)),
    url(r'^paying-for-college/$',
        LandingView.as_view(), name='standalone:pfc-landing'),
    url(r'^paying-for-college/understanding-financial-aid-offers/',
        include('paying_for_college.disclosures.urls',
                namespace='standalone-disclosures')),
    url(r'^paying-for-college/repaying-student-debt/',
        BaseTemplateView.as_view(template_name='repay_student_debt.html'),
        name='standalone-pfc-repay'),
    url(r'^paying-for-college/choosing-a-student-loan/$',
        BaseTemplateView.as_view(template_name='choose_a_loan.html'),
        name='standalone-pfc-choose'),
    url(r'^paying-for-college/managing-college-money/$',
        BaseTemplateView.as_view(template_name='manage_your_money.html'),
        name='standalone-pfc-manage'),
    url(r'^paying-for-college/demo/$',
        BaseTemplateView.as_view(template_name='just-a-demo.html'),
        name='standalone-pfc-demo'),
    ]
