import os
from PIL import Image

scratch_dir = r"C:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\scratch"
dest_dir = r"C:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\src\assets\images"

src_path = os.path.join(scratch_dir, "PK_124.jpg")
dest_path = os.path.join(dest_dir, "xray_room.jpg")

target_width = 800

if os.path.exists(src_path):
    with Image.open(src_path) as img:
        # アスペクト比を維持して縮小
        w_percent = (target_width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        
        resized_img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)
        
        # 保存 (JPEG, quality=85)
        resized_img.save(dest_path, "JPEG", quality=85)
        print(f"Resized PK_124.jpg -> xray_room.jpg ({target_width}x{h_size})")
else:
    print(f"Source file {src_path} does not exist!")
