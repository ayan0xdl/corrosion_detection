from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api.views import home, corrosion_detect, single_report, multiple_report, clear_results

urlpatterns = [
    path("", home),
    path("detect/", corrosion_detect),
    path("report/single/", single_report),
    path("report/multiple/", multiple_report),
    path("clear/", clear_results),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
