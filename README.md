# Corrosion Detection Web Application

A Django-based web application for detecting corrosion/rust in images using YOLOv11.

## Features

- Upload images for corrosion detection
- View both original and detected images side-by-side
- Download detected images with bounding boxes and labels
- Real-time image processing using YOLOv11 model

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Database Setup (Optional)

If you need database functionality:

```bash
python manage.py migrate
```

### 3. Run the Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

## Project Structure

```
corro-ui/
├── api/                    # Django app
│   ├── weights/           # YOLOv11 model weights
│   │   └── yolov11.pt
│   ├── views.py           # API views
│   ├── yolo.py            # YOLO detection logic
│   ├── urls.py            # URL routing
│   └── settings.py        # Django settings
├── static/                # Static files (CSS, JS)
│   ├── rust.css
│   └── rust.js
├── templates/             # HTML templates
│   └── rust.html
├── media/                 # Uploaded and processed images (created automatically)
├── manage.py             # Django management script
└── requirements.txt      # Python dependencies
```

## Usage

1. Open the application in your browser
2. Click "Choose File" to select an image
3. Click "Detect Corrosion" to process the image
4. View the original and detected images side-by-side
5. Download the detected image if needed

## API Endpoints

- `GET /` - Home page with upload interface
- `POST /detect/` - Process image and return detection results

## Notes

- The application processes images only (no video support)
- YOLOv11 weights should be placed in `api/weights/yolov11.pt`
- Processed images are saved in the `media/` directory
