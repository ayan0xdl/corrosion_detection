from ultralytics import YOLO
import cv2
import os
from django.conf import settings

# Load model once at module level
_model_path = os.path.join(os.path.dirname(__file__), "weights", "yolov11.pt")
model = YOLO(_model_path)

def detect_and_draw(image_path, output_filename):
    """
    Run YOLO detection on image and save annotated result.
    
    Args:
        image_path: Path to input image
        output_filename: Name for output file (will be saved in MEDIA_ROOT)
    
    Returns:
        Full path to saved output image
    """
    # Run detection
    results = model(image_path)
    
    # Read original image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image from {image_path}")

    # Draw bounding boxes and labels
    for r in results:
        for box in r.boxes:
            # Extract coordinates
            xyxy = box.xyxy[0].cpu().numpy() if hasattr(box.xyxy[0], 'cpu') else box.xyxy[0]
            x1, y1, x2, y2 = map(int, xyxy)
            
            # Extract class and confidence
            cls_val = box.cls[0].cpu().item() if hasattr(box.cls[0], 'cpu') else box.cls[0]
            cls_id = int(cls_val)
            cls_name = model.names[cls_id]
            
            conf_val = box.conf[0].cpu().item() if hasattr(box.conf[0], 'cpu') else box.conf[0]
            conf = float(conf_val)

            # Draw rectangle
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Draw label with background
            label = f"{cls_name} {conf:.2f}"
            (text_width, text_height), baseline = cv2.getTextSize(
                label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2
            )
            cv2.rectangle(
                img,
                (x1, y1 - text_height - 10),
                (x1 + text_width, y1),
                (0, 255, 0),
                -1
            )
            cv2.putText(
                img,
                label,
                (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 0),
                2,
            )

    # Save output in media directory
    output_path = os.path.join(settings.MEDIA_ROOT, output_filename)
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    cv2.imwrite(output_path, img)

    return output_path
