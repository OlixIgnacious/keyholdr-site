#!/usr/bin/env python3
"""Generate the Open Graph / social share image for the Keyholdr site."""

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPER = (244, 243, 239, 255)
INK = (18, 18, 18, 255)
INK_60 = (18, 18, 18, 153)

img = Image.new("RGBA", (W, H), PAPER)
draw = ImageDraw.Draw(img)

mono = ImageFont.truetype("/System/Library/Fonts/SFNSMono.ttf", 28)
title_font = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", 120)
sub_font = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", 40)

margin = 80

# Eyebrow
draw.text((margin, 70), "OPEN SOURCE · NATIVE MACOS & WINDOWS", font=mono, fill=INK_60)

# Title
draw.text((margin, 160), "Keyholdr", font=title_font, fill=INK)

# Tagline
draw.text((margin, 330), "Your keys, one keystroke away.", font=sub_font, fill=INK_60)
draw.text((margin, 390), "A native vault for your API keys.", font=sub_font, fill=INK_60)

# Key icon (mirrors the Windows tray icon: a literal key silhouette,
# scaled up from a 32x32 reference grid)
k = 8
ox, oy = 870, 180
stroke = round(3 * k)

# Bow (the loop you'd put on a keyring)
draw.ellipse(
    [ox + 10 * k, oy + 4 * k, ox + 22 * k, oy + 16 * k],
    outline=INK, width=stroke,
)


def line(x1, y1, x2, y2):
    draw.line(
        [(ox + x1 * k, oy + y1 * k), (ox + x2 * k, oy + y2 * k)],
        fill=INK, width=stroke, joint="curve",
    )


# Shaft
line(16, 16, 16, 28)
# Teeth
line(16, 22, 22, 22)
line(16, 26, 20, 26)

img.convert("RGB").save("og-image.png", "PNG")
print("wrote og-image.png", img.size)
