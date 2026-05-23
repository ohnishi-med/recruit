import os
import shutil

src_dir = r"\\192.168.1.240\Staff\01全員共用\90_写真\春日部クリニック様　施工写真"
dest_dir = r"C:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\scratch"

for i in range(124, 129):
    filename = f"PK_{i}.jpg"
    src_path = os.path.join(src_dir, filename)
    dest_path = os.path.join(dest_dir, filename)
    
    if os.path.exists(src_path):
        print(f"Copying {filename}...")
        shutil.copy(src_path, dest_path)
        print(f"Copied to {dest_path}")
    else:
        print(f"Source {filename} not found!")
