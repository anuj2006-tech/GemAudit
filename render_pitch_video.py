import os
import sys
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, "audio", "pitch")
OUTPUT_DIR = os.path.join(BASE_DIR, "frontend", "public", "downloads")
ROOT_OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
TEMP_DIR = os.path.join(BASE_DIR, "temp_video_build")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Font helper
def get_font(size, bold=False):
    font_path = "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"
    if not os.path.exists(font_path):
        font_path = "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"
    return ImageFont.truetype(font_path, size)

def draw_rounded_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def render_slide_1():
    img = Image.new('RGB', (1920, 1080), color='#090d16')
    draw = ImageDraw.Draw(img)

    # Top Header Bar
    draw_rounded_rect(draw, (80, 50, 480, 100), 25, fill='#1e293b', outline='#334155', width=1)
    draw.text((110, 62), "GeM Audit AI", font=get_font(24, True), fill='#38bdf8')
    draw.text((275, 64), "NATIONAL PROCUREMENT AUDIT", font=get_font(16, True), fill='#94a3b8')

    # Tag Badge
    draw_rounded_rect(draw, (80, 140, 270, 180), 20, fill='#450a0a', outline='#dc2626', width=2)
    draw.text((105, 148), "THE BIG PROBLEM", font=get_font(18, True), fill='#f87171')

    # Headline
    draw.text((80, 200), "Lakhs of Crores Trapped in Paperwork", font=get_font(52, True), fill='#ffffff')
    draw.text((80, 280), "Manual evaluation of government bids causes immense delays, corruption vulnerabilities, and false credentials.", font=get_font(26, False), fill='#94a3b8')

    # 3 Problem Cards
    cards = [
        ("5 to 7 Days Lost", "Officers spend 40+ hours manually checking dense PDFs and financial sheets.", "#f43f5e", "40+ Hours / Bid"),
        ("Fraudulent Claims", "Fake revenue numbers, fabricated experience, and ghost employee payrolls.", "#fb923c", "38% Flagged"),
        ("Project Delays", "Public infrastructure stalled for years due to non-compliant contractor disputes.", "#e11d48", "Years Delayed")
    ]

    for i, (title, desc, color, stat) in enumerate(cards):
        x0 = 80 + i * 590
        y0 = 380
        x1 = x0 + 550
        y1 = y0 + 380
        draw_rounded_rect(draw, (x0, y0, x1, y1), 24, fill='#0f172a', outline='#334155', width=2)
        draw_rounded_rect(draw, (x0 + 30, y0 + 30, x0 + 220, y0 + 75), 15, fill='#1e293b', outline=color, width=2)
        draw.text((x0 + 45, y0 + 40), stat, font=get_font(20, True), fill=color)
        draw.text((x0 + 30, y0 + 110), title, font=get_font(34, True), fill='#ffffff')
        
        # Wrapped text for desc
        words = desc.split()
        lines, line = [], ""
        for w in words:
            test = line + " " + w if line else w
            if draw.textlength(test, font=get_font(22, False)) < 480:
                line = test
            else:
                lines.append(line)
                line = w
        if line: lines.append(line)
        
        for li, ltext in enumerate(lines):
            draw.text((x0 + 30, y0 + 180 + li * 34), ltext, font=get_font(22, False), fill='#cbd5e1')

    # Bottom Banner
    draw_rounded_rect(draw, (80, 840, 1840, 980), 20, fill='#1c1917', outline='#7f1d1d', width=2)
    draw.text((120, 875), "DISQUALIFICATION RISK", font=get_font(22, True), fill='#f87171')
    draw.text((120, 915), "Honest bidders lose bids due to slow manual evaluation and opaque audit procedures.", font=get_font(24, False), fill='#e2e8f0')

    return img

def render_slide_2():
    img = Image.new('RGB', (1920, 1080), color='#090d16')
    draw = ImageDraw.Draw(img)

    draw_rounded_rect(draw, (80, 50, 480, 100), 25, fill='#1e293b', outline='#334155', width=1)
    draw.text((110, 62), "GeM Audit AI", font=get_font(24, True), fill='#38bdf8')
    draw.text((275, 64), "NATIONAL PROCUREMENT AUDIT", font=get_font(16, True), fill='#94a3b8')

    draw_rounded_rect(draw, (80, 140, 390, 180), 20, fill='#064e3b', outline='#10b981', width=2)
    draw.text((105, 148), "STEP 1: 3-SECOND VERIFICATION", font=get_font(18, True), fill='#34d399')

    draw.text((80, 200), "Meet GeM Audit: AI Forensic Verification", font=get_font(52, True), fill='#ffffff')
    draw.text((80, 280), "Automated OCR & Vision models cross-reference bid data against 10 government registries in real time.", font=get_font(26, False), fill='#94a3b8')

    # 10 Registry Grid Cards
    registries = [
        ("GSTN Tax Portal", "Active Tax Returns", "#10b981"),
        ("Ministry of Corporate Affairs", "Real Company Directors", "#10b981"),
        ("CBDT PAN Database", "Permanent Account Identity", "#10b981"),
        ("Udyam MSME Portal", "Enterprise Scale & Subsidies", "#10b981"),
        ("EPFO Payroll Records", "Verified Employee Counts", "#f59e0b"),
        ("ESIC Insurance System", "Worker Health Benefits", "#10b981"),
        ("GeM Debarment Watchlist", "Zero Blacklisting Check", "#10b981"),
        ("DigiLocker Verification", "Digitally Signed Certificates", "#10b981"),
        ("Make In India Portal", "Class-1 Local Content (68%)", "#10b981"),
        ("Startup India System", "DPIIT Recognized Startup", "#10b981")
    ]

    for i, (name, role, col) in enumerate(registries):
        col_idx = i % 5
        row_idx = i // 5
        x0 = 80 + col_idx * 355
        y0 = 370 + row_idx * 210
        x1 = x0 + 335
        y1 = y0 + 180
        draw_rounded_rect(draw, (x0, y0, x1, y1), 18, fill='#0f172a', outline='#1e293b', width=2)
        draw_rounded_rect(draw, (x0 + 20, y0 + 20, x0 + 100, y0 + 50), 10, fill='#1e293b', outline=col, width=1)
        draw.text((x0 + 32, y0 + 25), "LIVE", font=get_font(14, True), fill=col)
        draw.text((x0 + 20, y0 + 75), name, font=get_font(18, True), fill='#ffffff')
        draw.text((x0 + 20, y0 + 115), role, font=get_font(16, False), fill='#94a3b8')

    # Bottom Stat Highlight
    draw_rounded_rect(draw, (80, 830, 1840, 980), 20, fill='#022c22', outline='#059669', width=2)
    draw.text((120, 865), "3 SECONDS AUDIT TIME", font=get_font(24, True), fill='#34d399')
    draw.text((120, 908), "Reduces procurement evaluation from 7 days to 3 seconds with complete data provenance.", font=get_font(24, False), fill='#e2e8f0')

    return img

def render_slide_3():
    img = Image.new('RGB', (1920, 1080), color='#090d16')
    draw = ImageDraw.Draw(img)

    draw_rounded_rect(draw, (80, 50, 480, 100), 25, fill='#1e293b', outline='#334155', width=1)
    draw.text((110, 62), "GeM Audit AI", font=get_font(24, True), fill='#38bdf8')
    draw.text((275, 64), "NATIONAL PROCUREMENT AUDIT", font=get_font(16, True), fill='#94a3b8')

    draw_rounded_rect(draw, (80, 140, 310, 180), 20, fill='#451a03', outline='#d97706', width=2)
    draw.text((105, 148), "STEP 2: LIVE DETECTION", font=get_font(18, True), fill='#fbbf24')

    draw.text((80, 200), "Catching Fraud Live: Revenue Mismatch", font=get_font(52, True), fill='#ffffff')
    draw.text((80, 280), "Live cross-triangulation between submitted CA certificates and official GST returns.", font=get_font(26, False), fill='#94a3b8')

    # Comparison Columns
    # Left: Bid Claim
    draw_rounded_rect(draw, (80, 370, 920, 800), 24, fill='#1c1917', outline='#b45309', width=2)
    draw_rounded_rect(draw, (120, 410, 380, 460), 14, fill='#451a03', outline='#f59e0b', width=1)
    draw.text((140, 420), "CLAIMED IN BID PDF", font=get_font(18, True), fill='#fbbf24')
    draw.text((120, 500), "₹18.40 Crore", font=get_font(60, True), fill='#f87171')
    draw.text((120, 580), "Turnover Stated by Contractor", font=get_font(24, True), fill='#ffffff')
    draw.text((120, 630), "• Submitted forged CA audited certificate\n• Stated 120 full-time software engineers\n• Claimed Class-1 Local Supplier status", font=get_font(22, False), fill='#cbd5e1')

    # Right: Verified Reality
    draw_rounded_rect(draw, (1000, 370, 1840, 800), 24, fill='#022c22', outline='#059669', width=2)
    draw_rounded_rect(draw, (1040, 410, 1370, 460), 14, fill='#064e3b', outline='#10b981', width=1)
    draw.text((1060, 420), "OFFICIAL GSTN PORTAL LIVE", font=get_font(18, True), fill='#34d399')
    draw.text((1040, 500), "₹4.20 Crore", font=get_font(60, True), fill='#34d399')
    draw.text((1040, 580), "Actual Real Turnover on Tax System", font=get_font(24, True), fill='#ffffff')
    draw.text((1040, 630), "• Exact GST filing GSTR-3B shows ₹4.2Cr\n• EPFO payroll confirms only 14 real staff\n• Discrepancy: ₹14.2 Crore Inflated", font=get_font(22, False), fill='#cbd5e1')

    # Bottom Auto Action
    draw_rounded_rect(draw, (80, 840, 1840, 980), 20, fill='#3f1212', outline='#ef4444', width=2)
    draw.text((120, 875), "AUTOMATIC DISQUALIFICATION NOTICE GENERATED", font=get_font(24, True), fill='#f87171')
    draw.text((120, 915), "GeM Audit automatically drafts a legally sealed rejection notice citing Clause 4.2 of GTC.", font=get_font(24, False), fill='#ffffff')

    return img

def render_slide_4():
    img = Image.new('RGB', (1920, 1080), color='#090d16')
    draw = ImageDraw.Draw(img)

    draw_rounded_rect(draw, (80, 50, 480, 100), 25, fill='#1e293b', outline='#334155', width=1)
    draw.text((110, 62), "GeM Audit AI", font=get_font(24, True), fill='#38bdf8')
    draw.text((275, 64), "NATIONAL PROCUREMENT AUDIT", font=get_font(16, True), fill='#94a3b8')

    draw_rounded_rect(draw, (80, 140, 270, 180), 20, fill='#0c4a6e', outline='#0284c7', width=2)
    draw.text((105, 148), "SAFETY & TRUST", font=get_font(18, True), fill='#38bdf8')

    draw.text((80, 200), "Permanent Digital Proof: SHA-256 Ledger", font=get_font(52, True), fill='#ffffff')
    draw.text((80, 280), "Cryptographic timestamping prevents officer harassment and guarantees audit integrity.", font=get_font(26, False), fill='#94a3b8')

    cards = [
        ("Cryptographic Sealing", "Every document, timestamp, and registry response is hashed using SHA-256 algorithms.", "#38bdf8", "SHA-256 HASH"),
        ("Legal Court Admissibility", "Tamper-proof evidence ledger ready for CBI, CVC, or CAG scrutiny queries.", "#818cf8", "CVC & CAG READY"),
        ("Protecting Honest Officers", "Zero suspicion or false accusations against procurement evaluation committees.", "#34d399", "OFFICER SHIELD")
    ]

    for i, (title, desc, color, tag) in enumerate(cards):
        x0 = 80 + i * 590
        y0 = 380
        x1 = x0 + 550
        y1 = y0 + 400
        draw_rounded_rect(draw, (x0, y0, x1, y1), 24, fill='#0f172a', outline='#334155', width=2)
        draw_rounded_rect(draw, (x0 + 30, y0 + 30, x0 + 260, y0 + 75), 15, fill='#1e293b', outline=color, width=2)
        draw.text((x0 + 45, y0 + 40), tag, font=get_font(18, True), fill=color)
        draw.text((x0 + 30, y0 + 115), title, font=get_font(30, True), fill='#ffffff')
        
        words = desc.split()
        lines, line = [], ""
        for w in words:
            test = line + " " + w if line else w
            if draw.textlength(test, font=get_font(22, False)) < 480:
                line = test
            else:
                lines.append(line)
                line = w
        if line: lines.append(line)
        for li, ltext in enumerate(lines):
            draw.text((x0 + 30, y0 + 195 + li * 34), ltext, font=get_font(22, False), fill='#cbd5e1')

    # Hash Demonstration Bar
    draw_rounded_rect(draw, (80, 830, 1840, 980), 20, fill='#082f49', outline='#0284c7', width=2)
    draw.text((120, 865), "IMMUTABLE AUDIT HASH RECORD", font=get_font(22, True), fill='#38bdf8')
    draw.text((120, 908), "HASH: 8f3c5b9e021a4d7f6c8e9b1a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e (STAMPED)", font=get_font(22, True), fill='#f8fafc')

    return img

def render_slide_5():
    img = Image.new('RGB', (1920, 1080), color='#090d16')
    draw = ImageDraw.Draw(img)

    draw_rounded_rect(draw, (80, 50, 480, 100), 25, fill='#1e293b', outline='#334155', width=1)
    draw.text((110, 62), "GeM Audit AI", font=get_font(24, True), fill='#38bdf8')
    draw.text((275, 64), "NATIONAL PROCUREMENT AUDIT", font=get_font(16, True), fill='#94a3b8')

    draw_rounded_rect(draw, (80, 140, 330, 180), 20, fill='#4c1d95', outline='#8b5cf6', width=2)
    draw.text((105, 148), "48-HOUR DEADLINE", font=get_font(18, True), fill='#a78bfa')

    draw.text((80, 200), "The 48-Hour Seller Clarification Bot", font=get_font(52, True), fill='#ffffff')
    draw.text((80, 280), "When officers request clarifications on GeM, sellers get only 48 hours before auto-rejection.", font=get_font(26, False), fill='#94a3b8')

    # Left: The Threat
    draw_rounded_rect(draw, (80, 370, 920, 800), 24, fill='#1f1235', outline='#7c3aed', width=2)
    draw_rounded_rect(draw, (120, 410, 390, 460), 14, fill='#3b0764', outline='#a78bfa', width=1)
    draw.text((140, 420), "STRICT GeM REGULATION", font=get_font(18, True), fill='#c084fc')
    draw.text((120, 500), "48-Hour Deadline", font=get_font(50, True), fill='#f43f5e')
    draw.text((120, 570), "Missed reply = Instant Rejection", font=get_font(24, True), fill='#ffffff')
    draw.text((120, 620), "• Small businesses miss tight response times\n• Hard to locate previous turnover certificates\n• Lost revenue due to administrative delays", font=get_font(22, False), fill='#cbd5e1')

    # Right: The AI Solution
    draw_rounded_rect(draw, (1000, 370, 1840, 800), 24, fill='#064e3b', outline='#10b981', width=2)
    draw_rounded_rect(draw, (1040, 410, 1370, 460), 14, fill='#022c22', outline='#34d399', width=1)
    draw.text((1060, 420), "GeM AUDIT AI ASSISTANT", font=get_font(18, True), fill='#34d399')
    draw.text((1040, 500), "45 Seconds Reply", font=get_font(50, True), fill='#34d399')
    draw.text((1040, 570), "Instant Retrieval & Response Drafting", font=get_font(24, True), fill='#ffffff')
    draw.text((1040, 620), "• AI scans company repository for certificates\n• Auto-drafts formal response letter for GeM\n• Secures bid eligibility with zero missed deadlines", font=get_font(22, False), fill='#cbd5e1')

    # Bottom Callout
    draw_rounded_rect(draw, (80, 840, 1840, 980), 20, fill='#2e1065', outline='#8b5cf6', width=2)
    draw.text((120, 875), "PRESERVING MSME PARTICIPATION", font=get_font(24, True), fill='#c084fc')
    draw.text((120, 915), "Ensures small businesses never lose lucrative government contracts over minor paperwork delays.", font=get_font(24, False), fill='#ffffff')

    return img

def render_slide_6():
    img = Image.new('RGB', (1920, 1080), color='#090d16')
    draw = ImageDraw.Draw(img)

    draw_rounded_rect(draw, (80, 50, 480, 100), 25, fill='#1e293b', outline='#334155', width=1)
    draw.text((110, 62), "GeM Audit AI", font=get_font(24, True), fill='#38bdf8')
    draw.text((275, 64), "NATIONAL PROCUREMENT AUDIT", font=get_font(16, True), fill='#94a3b8')

    draw_rounded_rect(draw, (80, 140, 270, 180), 20, fill='#064e3b', outline='#10b981', width=2)
    draw.text((105, 148), "NATIONAL IMPACT", font=get_font(18, True), fill='#34d399')

    draw.text((80, 200), "Fast, Clean & Honest Bids for India", font=get_font(52, True), fill='#ffffff')
    draw.text((80, 280), "Making public procurement 96% faster, 100% transparent, and fraud-free across India.", font=get_font(26, False), fill='#94a3b8')

    metrics = [
        ("96% Faster", "7 Days to 8 Minutes", "From 168 hours of manual checking down to 8 minutes per batch.", "#10b981"),
        ("₹15,000 Saved", "Per Evaluated Tender", "Saves crores in administrative overhead and committee expenses.", "#38bdf8"),
        ("1 Single Officer", "Versus 5-Member Team", "Streamlines committee workloads and eliminates human error.", "#818cf8")
    ]

    for i, (stat, subtitle, desc, col) in enumerate(metrics):
        x0 = 80 + i * 590
        y0 = 380
        x1 = x0 + 550
        y1 = y0 + 400
        draw_rounded_rect(draw, (x0, y0, x1, y1), 24, fill='#0f172a', outline='#334155', width=2)
        draw.text((x0 + 40, y0 + 45), stat, font=get_font(56, True), fill=col)
        draw.text((x0 + 40, y0 + 130), subtitle, font=get_font(24, True), fill='#ffffff')
        
        words = desc.split()
        lines, line = [], ""
        for w in words:
            test = line + " " + w if line else w
            if draw.textlength(test, font=get_font(22, False)) < 460:
                line = test
            else:
                lines.append(line)
                line = w
        if line: lines.append(line)
        for li, ltext in enumerate(lines):
            draw.text((x0 + 40, y0 + 190 + li * 34), ltext, font=get_font(22, False), fill='#94a3b8')

    # Grand Conclusion Banner
    draw_rounded_rect(draw, (80, 830, 1840, 980), 20, fill='#022c22', outline='#059669', width=2)
    draw.text((120, 865), "SMART INDIA HACKATHON 2026 — GeM AUDIT AI", font=get_font(24, True), fill='#34d399')
    draw.text((120, 908), "Empowering transparent governance with state-of-the-art AI forensic document audit.", font=get_font(24, False), fill='#ffffff')

    return img

def main():
    print("Generating 6 Slide Images in 1080p...")
    slide_funcs = [
        render_slide_1,
        render_slide_2,
        render_slide_3,
        render_slide_4,
        render_slide_5,
        render_slide_6
    ]

    slide_images = []
    for idx, fn in enumerate(slide_funcs, 1):
        img = fn()
        img_path = os.path.join(TEMP_DIR, f"slide_{idx}.png")
        img.save(img_path)
        slide_images.append(img_path)
        print(f"Rendered slide {idx}: {img_path}")

    # Build individual video clips for each slide using its audio
    clip_files = []
    for idx in range(1, 7):
        img_file = os.path.join(TEMP_DIR, f"slide_{idx}.png")
        audio_file = os.path.join(AUDIO_DIR, f"scene{idx}.mp3")
        clip_output = os.path.join(TEMP_DIR, f"clip_{idx}.mp4")

        print(f"Encoding Scene {idx} with audio: {audio_file}...")
        # FFmpeg command: loop image over audio duration
        cmd = [
            FFMPEG,
            "-y",
            "-loop", "1",
            "-i", img_file,
            "-i", audio_file,
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            clip_output
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode != 0:
            print(f"Error encoding clip {idx}:", res.stderr.decode('utf-8', errors='ignore'))
            sys.exit(1)
        clip_files.append(clip_output)
        print(f"Scene {idx} clip created: {clip_output}")

    # Create concat list file
    concat_list_path = os.path.join(TEMP_DIR, "concat_list.txt")
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for clip in clip_files:
            norm_path = clip.replace("\\", "/")
            f.write(f"file '{norm_path}'\n")

    # Concatenate all clips into final video
    final_output_public = os.path.join(OUTPUT_DIR, "GeM_Audit_Pitch_Presentation.mp4")
    final_output_root = os.path.join(ROOT_OUTPUT_DIR, "GeM_Audit_Pitch_Presentation.mp4")

    print(f"Concatenating all scenes into {final_output_public}...")
    concat_cmd = [
        FFMPEG,
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-c", "copy",
        final_output_public
    ]
    res = subprocess.run(concat_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode != 0:
        print("Error during concat:", res.stderr.decode('utf-8', errors='ignore'))
        sys.exit(1)

    # Copy to root project dir
    shutil.copy2(final_output_public, final_output_root)
    print("\nSUCCESS! Pitch Video generated successfully!")
    print(f"Public Download Path: {final_output_public} ({os.path.getsize(final_output_public)} bytes)")
    print(f"Root Workspace Path:  {final_output_root}")

if __name__ == "__main__":
    main()
