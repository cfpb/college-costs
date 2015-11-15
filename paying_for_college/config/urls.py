from django.conf.urls import url, include
from django.conf import settings
from disclosures.views import LandingView
from django.contrib import admin
# from django.conf.urls.static import static

urlpatterns = [
    url(r'^paying-for-college/admin/', include(admin.site.urls)),
    url(r'^paying-for-college/$',
        LandingView.as_view(), name='pfc-landing'),
    url(r'^paying-for-college/compare-financial-aid-and-college-cost/',
        include('disclosures.urls', namespace='disclosures')),
    url(r'^paying-for-college/repay-student-debt/',
        include('debt.urls', namespace='debt')),
    url(r'^paying-for-college/guides/',
        include('guides.urls', namespace='guides')),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL,
#                           document_root=settings.STATIC_ROOT)
