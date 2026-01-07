import os
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
from .yolo import detect_and_draw

def home(request):
    return render(request, "rust.html")

@csrf_exempt
def corrosion_detect(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=400)

    image = request.FILES.get("image")
    if not image:
        return JsonResponse({"error": "No image"}, status=400)

    # Save original image
    original_path = default_storage.save(image.name, image)
    original_full_path = default_storage.path(original_path)
    
    # Generate unique name for output to avoid conflicts
    base_name = os.path.splitext(image.name)[0]
    ext = os.path.splitext(image.name)[1]
    output_name = f"{base_name}_detected{ext}"
    
    # Run detection
    output_path = detect_and_draw(original_full_path, output_name)
    output_relative_path = os.path.relpath(output_path, settings.MEDIA_ROOT)
    
    # Get original image URL
    original_url = f"/media/{original_path}"

    return JsonResponse({
        "original_image_url": original_url,
        "detected_image_url": f"/media/{output_relative_path}"
    })
