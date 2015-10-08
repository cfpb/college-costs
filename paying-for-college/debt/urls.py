from django.conf.urls import url
from disclosures.views import TemplateView

urlpatterns = [
    url(r'^choose-a-student-loan/$', TemplateView.as_view(template_name='choose_a_loan.html'), name='pfc-choose'),
    url(r'^manage-your-college-money/$', TemplateView.as_view(template_name='manage_your_money.html'), name='pfc-manage'),
    url(r'^repay-student-debt/$', TemplateView.as_view(template_name='repay_student_debt.html'), name='pfc-repay')
]
