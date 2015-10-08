from django.conf.urls import url, include
from django.conf import settings
from disclosures.views import TemplateView
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$',
        TemplateView.as_view(template_name='landing.html'),
        name='pfc-landing'),
    url(r'^disclosures/',
        include('disclosures.urls', namespace='disclosures')),
    url(r'^debt/',
        include('debt.urls', namespace='debt')),
    # url(r'^guides/',
    #     include('guides.urls', namespace='guides')),
]
