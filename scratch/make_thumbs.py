import os
from PIL import Image

scratch_dir = r"C:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\scratch"
thumb_dir = os.path.join(scratch_dir, "thumbs")
os.makedirs(thumb_dir, exist_ok=True)

for i in range(124, 129):
    filename = f"PK_{i}.jpg"
    path = os.path.join(scratch_dir, filename)
    if os.path.exists(path):
        with Image.open(path) as img:
            img.thumbnail((600, 600))
            out_path = os.path.join(thumb_dir, f"PK_{i}_thumb.jpg")
            img.save(out_path, "JPEG", quality=80)
            print(f"Created thumb: {out_path}")
