import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('d:/myweb/python_bot')
from bot.key_manager import get_next_api_key
from google import genai
import google.genai.types as types

try:
    k = get_next_api_key()
    c = genai.Client(api_key=k)
    print('Key:', k[:5])
    res = c.models.generate_images(
        model='imagen-3.0-generate-001', 
        prompt='A beautiful sunset over the mountains', 
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="16:9",
            output_mime_type="image/jpeg"
        )
    )
    if res.generated_images:
        img_bytes = res.generated_images[0].image.image_bytes
        print(f"Generated {len(img_bytes)} bytes of image data successfully!")
    else:
        print("No images generated!")
except Exception as e:
    print('Error:', e)
