from django.conf.urls import url, include
from django.conf import settings
from paying_for_college.views import LandingView
from django.contrib import admin
# from django.conf.urls.static import static

urlpatterns = [
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^$',
        LandingView.as_view(), name='pfc-landing'),
    url(r'^compare-financial-aid-and-college-cost/',
        include('paying_for_college.disclosures.urls', namespace='disclosures')),
    url(r'^repay-student-debt/',
        include('paying_for_college.debt.urls', namespace='debt')),
    url(r'^guides/',
        include('paying_for_college.guides.urls', namespace='guides')),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#                           document_root=settings.STATIC_ROOT)
