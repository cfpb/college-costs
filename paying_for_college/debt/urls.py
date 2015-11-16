from django.conf.urls import url
from paying_for_college.views import StandAloneView

urlpatterns = [
    url(r'^$',
        StandAloneView.as_view(template_name='repay_student_debt.html'),
        name='pfc-repay')
]
