#!/usr/bin/env python3
"""
Banner Optimization Tool for Plotfolio
Scales and centers all banner images to the exact golden dimensions: 734x206
using high-fidelity Lanczos resampling.
"""

import os
import glob
import re
from PIL import Image, ImageOps

SOURCE_DIR = r"C:\Users\Admin\Desktop\pfp and banner\banner"
TARGET_DIR = r"C:\Users\Admin\Desktop\plotfolio\assets\banners"
SCRIPT_JS_PATH = r"C:\Users\Admin\Desktop\plotfolio\script.js"

TARGET_WIDTH = 734
TARGET_HEIGHT = 206
TARGET_SIZE = (TARGET_WIDTH, TARGET_HEIGHT)

def process_all_banners():
    os.makedirs(TARGET_DIR, exist_ok=True)

    # Clean existing banners in target
    for old_file in glob.glob(os.path.join(TARGET_DIR, "banner-*.jpg")):
        try:
            os.remove(old_file)
        except Exception:
            pass

    # Find source images
    valid_exts = (".jpg", ".jpeg", ".png", ".webp")
    source_files = [
        f for f in sorted(os.listdir(SOURCE_DIR))
        if os.path.isfile(os.path.join(SOURCE_DIR, f)) and f.lower().endswith(valid_exts)
    ]

    print(f"Found {len(source_files)} source banners in {SOURCE_DIR}")
    saved_banners = []

    for idx, fname in enumerate(source_files, start=1):
        src_path = os.path.join(SOURCE_DIR, fname)
        dst_name = f"banner-{idx}.jpg"
        dst_path = os.path.join(TARGET_DIR, dst_name)

        try:
            with Image.open(src_path) as img:
                # Convert RGBA / Palette images to RGB
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

                # High-fidelity fit using Lanczos filter centered
                fitted = ImageOps.fit(
                    img,
                    TARGET_SIZE,
                    method=Image.Resampling.LANCZOS,
                    centering=(0.5, 0.5)
                )

                # Save with maximum fidelity (quality=95, no chroma subsampling)
                fitted.save(dst_path, "JPEG", quality=95, subsampling=0)
                saved_banners.append(f"assets/banners/{dst_name}")
                print(f"  [OK] Processed [{fname}] -> {dst_name} ({TARGET_WIDTH}x{TARGET_HEIGHT})")
        except Exception as e:
            print(f"  [ERROR] Failed to process [{fname}]: {e}")

    # Update script.js with the fresh BANNER_POOL array
    if os.path.exists(SCRIPT_JS_PATH) and saved_banners:
        with open(SCRIPT_JS_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        banners_js_str = ",\n  ".join([f"'{b}'" for b in saved_banners])
        new_pool_str = f"const BANNER_POOL = [\n  {banners_js_str},\n];"

        updated_content = re.sub(
            r"const BANNER_POOL = \[[^\]]*\];",
            new_pool_str,
            content
        )

        with open(SCRIPT_JS_PATH, "w", encoding="utf-8") as f:
            f.write(updated_content)

        print(f"\nUpdated script.js with {len(saved_banners)} active banners in BANNER_POOL.")

if __name__ == "__main__":
    process_all_banners()
