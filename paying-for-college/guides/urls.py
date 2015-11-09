from django.conf.urls import url
from disclosures.views import StandAloneView

urlpatterns = [
    url(r'^choose-a-student-loan/$',
        StandAloneView.as_view(template_name='choose_a_loan.html'),
        name='pfc-choose'),
    url(r'^manage-your-college-money/$',
        StandAloneView.as_view(template_name='manage_your_money.html'),
        name='pfc-manage'),
]
