import os
from PIL import Image

image_dir = r"C:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\src\assets\images"
images = ["dialysis_room.jpg", "exterior.jpg", "reception.jpg", "staff_room.jpg", "station.jpg"]

for img_name in images:
    path = os.path.join(image_dir, img_name)
    if os.path.exists(path):
        with Image.open(path) as img:
            print(f"{img_name}: {img.width}x{img.height} ({img.format})")
    else:
        print(f"{img_name} does not exist")
