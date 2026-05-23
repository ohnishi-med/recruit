import os
import glob
from PIL import Image, ImageDraw, ImageFont

def create_contact_sheet():
    photo_dir = r"\\192.168.1.240\Staff\01全員共用\90_写真\春日部クリニック様　施工写真"
    pattern = os.path.join(photo_dir, "PK_*.jpg")
    files = sorted(glob.glob(pattern))
    
    if not files:
        print("No files found matching PK_*.jpg")
        return
    
    print(f"Found {len(files)} files.")
    
    # グリッド設定
    cols = 15
    rows = (len(files) + cols - 1) // cols
    
    thumb_w = 120
    thumb_h = 90
    spacing = 10
    
    sheet_w = cols * (thumb_w + spacing) + spacing
    sheet_h = rows * (thumb_h + spacing) + spacing
    
    # シート作成（背景はグレー）
    sheet = Image.new('RGB', (sheet_w, sheet_h), (200, 200, 200))
    draw = ImageDraw.Draw(sheet)
    
    # 簡易フォント（なければデフォルト）
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
        
    for i, filepath in enumerate(files):
        try:
            basename = os.path.basename(filepath)
            num_str = basename.replace("PK_", "").replace(".jpg", "")
            
            # サムネイル作成
            with Image.open(filepath) as img:
                img.thumbnail((thumb_w, thumb_h))
                
                # 中央配置用のオフセット計算
                offset_x = (thumb_w - img.width) // 2
                offset_y = (thumb_h - img.height) // 2
                
                # 位置計算
                r = i // cols
                c = i % cols
                x = spacing + c * (thumb_w + spacing)
                y = spacing + r * (thumb_h + spacing)
                
                sheet.paste(img, (x + offset_x, y + offset_y))
                
                # テキスト描画 (ファイル名番号)
                draw.rectangle([x, y, x + 40, y + 15], fill=(0, 0, 0))
                draw.text((x + 2, y + 2), num_str, fill=(255, 255, 255), font=font)
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            
    # 保存
    output_dir = r"c:\Users\coino\AntigravityWorkspace\projects\clinic\recruit-site\scratch"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_path = os.path.join(output_dir, "contact_sheet.png")
    sheet.save(output_path)
    print(f"Saved contact sheet to {output_path}")

if __name__ == "__main__":
    create_contact_sheet()
