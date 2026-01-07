from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api.views import home, corrosion_detect

urlpatterns = [
    path("", home),
    path("detect/", corrosion_detect),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
