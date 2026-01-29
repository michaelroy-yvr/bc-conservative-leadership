#!/usr/bin/env python3
"""Download and crop candidate photos around detected faces."""

import csv
import os
import urllib.request
import ssl
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from io import BytesIO

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PHOTOS_DIR = PROJECT_DIR / "public" / "photos"
CSV_PATH = Path.home() / "Downloads" / "BC Conservative Leadership 2026 - Sheet1.csv"

# Create photos directory if needed
PHOTOS_DIR.mkdir(parents=True, exist_ok=True)

# Load OpenCV face detector
face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(face_cascade_path)


def slugify(name: str) -> str:
    """Convert name to filename-safe slug."""
    return name.lower().replace(" ", "-").replace(".", "")


def download_image(url: str) -> Image.Image | None:
    """Download image from URL and return PIL Image."""
    if not url or url.strip() == "":
        return None

    try:
        # Create SSL context that doesn't verify (for some CDN URLs)
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        # Set up request with browser-like headers
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })

        with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
            data = response.read()
            return Image.open(BytesIO(data))
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return None


def detect_face(img: Image.Image) -> tuple[int, int, int, int] | None:
    """Detect face in image and return bounding box (x, y, w, h)."""
    # Convert PIL to OpenCV format
    cv_img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    if len(faces) == 0:
        return None

    # Return largest face
    largest = max(faces, key=lambda f: f[2] * f[3])
    return tuple(largest)


def crop_around_face(img: Image.Image, face_box: tuple[int, int, int, int] | None) -> Image.Image:
    """Crop image around face with padding. Don't force aspect ratio - let CSS handle it."""
    width, height = img.size

    if face_box:
        x, y, w, h = face_box
        # Center of face
        center_x = x + w // 2
        center_y = y + h // 2

        # Add generous padding around face (2x the face size on each side)
        # This gives context without too much empty space
        face_size = max(w, h)
        padding_x = face_size * 1.5
        padding_top = face_size * 0.8  # Less padding above (forehead)
        padding_bottom = face_size * 2.0  # More padding below (shoulders)

        left = center_x - padding_x
        right = center_x + padding_x
        top = y - padding_top
        bottom = y + h + padding_bottom
    else:
        # No face detected - do a center crop focusing on upper portion
        crop_size = min(width, height) * 0.9
        left = (width - crop_size) // 2
        right = left + crop_size
        top = height * 0.05
        bottom = top + crop_size

    # Clamp to image bounds
    left = max(0, int(left))
    top = max(0, int(top))
    right = min(width, int(right))
    bottom = min(height, int(bottom))

    # Crop
    cropped = img.crop((left, top, right, bottom))

    # Scale down if too large, but maintain aspect ratio
    max_dimension = 800
    if cropped.width > max_dimension or cropped.height > max_dimension:
        ratio = max_dimension / max(cropped.width, cropped.height)
        new_size = (int(cropped.width * ratio), int(cropped.height * ratio))
        cropped = cropped.resize(new_size, Image.Resampling.LANCZOS)

    return cropped


def process_candidates():
    """Process all candidates from CSV."""
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            name = row['Name'].strip()
            photo_url = row['Photo'].strip()

            if not name:
                continue

            slug = slugify(name)
            output_path = PHOTOS_DIR / f"{slug}.jpg"

            print(f"Processing {name}...")

            if not photo_url:
                print(f"  No photo URL, skipping")
                continue

            # Download image
            img = download_image(photo_url)
            if img is None:
                print(f"  Failed to download, skipping")
                continue

            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')

            print(f"  Downloaded: {img.size}")

            # Detect face
            face_box = detect_face(img)
            if face_box:
                print(f"  Face detected at {face_box}")
            else:
                print(f"  No face detected, using center crop")

            # Crop around face
            cropped = crop_around_face(img, face_box)
            print(f"  Cropped to: {cropped.size}")

            # Save
            cropped.save(output_path, 'JPEG', quality=90)
            print(f"  Saved: {output_path}")


if __name__ == '__main__':
    process_candidates()
