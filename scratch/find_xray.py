import os
import glob

photo_dir = r"\\192.168.1.240\Staff\01全員共用\90_写真\春日部クリニック様　施工写真"
print(f"Checking directory: {photo_dir}")

for i in range(124, 129):
    filename = f"PK_{i}.jpg"
    path = os.path.join(photo_dir, filename)
    if os.path.exists(path):
        print(f"Found: {filename} ({os.path.getsize(path)} bytes)")
    else:
        # 大文字小文字のチェックも念のため
        filename_lower = f"pk_{i}.jpg"
        path_lower = os.path.join(photo_dir, filename_lower)
        if os.path.exists(path_lower):
            print(f"Found (lower): {filename_lower} ({os.path.getsize(path_lower)} bytes)")
        else:
            # 拡張子 jpeg や png のチェック
            alternatives = glob.glob(os.path.join(photo_dir, f"*_{i}.*"))
            if alternatives:
                print(f"Found alternatives for {i}: {alternatives}")
            else:
                print(f"Not found: {filename}")
