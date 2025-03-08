import os
import sys
from PIL import Image

def generate_thumbnail(img):
    path, filename = os.path.split(img)
    no_ext = os.path.splitext(filename)[0]
    thumbnail_name = no_ext + '_thumbnail.jpg'

    if os.path.exists(os.path.join(path, thumbnail_name)):
        print(f'Thumbnail already exists for {filename}')
        return

    im = Image.open(img)
    im.thumbnail((256, 256))
    im = im.convert('RGB')

    im.save(os.path.join(path, thumbnail_name), 'JPEG')

    print(f'Created thumbnail for {filename}')

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: pytthon thumbnailify img.png")
        exit(0)

    generate_thumbnail(sys.argv[1])
