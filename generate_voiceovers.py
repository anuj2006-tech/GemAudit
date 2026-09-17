import asyncio
import os
import shutil
import re
import subprocess
import edge_tts
import imageio_ffmpeg

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# Refined natural human pitch script with natural speaking cadence and realistic punctuation
VOICEOVERS = [
    {
        "id": 1,
        "title": "The Paperwork Problem",
        "tag": "THE BIG PROBLEM",
        "text": "Every single year, the Indian government awards lakhs of crores in public contracts. Yet, procurement officers still spend days manually sifting through stacks of paper. Meanwhile, dishonest contractors exploit these loopholes with forged certificates, stalling critical national projects for years.",
        "subtitles": [
            ("Every single year, the government awards lakhs of crores in contracts.", 0, 5),
            ("Yet, procurement officers still spend days checking stacks of paper by hand.", 5, 11),
            ("Dishonest bidders exploit loopholes with fake certificates, delaying projects for years.", 11, 18)
        ]
    },
    {
        "id": 2,
        "title": "Meet GeM Audit (Bid Document Verification)",
        "tag": "STEP 1: 3-SECOND AUDIT",
        "text": "Enter GeM Audit. Instead of days of grueling manual checks, our AI inspects the entire bid dossier and cross-verifies credentials against ten live government registries in just three seconds. Instantly, it catches fraudulent claims and alerts the evaluation committee.",
        "subtitles": [
            ("Enter GeM Audit: replacing days of grueling manual checks.", 0, 5),
            ("Our AI inspects the entire bid against 10 government registries in 3 seconds.", 5, 12),
            ("Instantly, it catches fraudulent claims and alerts the evaluation committee.", 12, 18)
        ]
    },
    {
        "id": 3,
        "title": "Catching Fake Claims Live",
        "tag": "STEP 2: LIVE DETECTION",
        "text": "Here is that live forensic verification in action. In their bid submission, a contractor claimed eighteen crore rupees in annual turnover. But when our system pinged the live GST portal, their real filed revenue was barely four crore. The AI catches the fabrication on the spot and drafts a legally sealed rejection notice.",
        "subtitles": [
            ("Here is that live forensic verification in action.", 0, 4),
            ("Bid document claimed ₹18 Crore turnover, but live GST portal showed barely ₹4 Crore.", 4, 11),
            ("The AI catches the fabrication on the spot and auto-drafts a sealed rejection notice.", 11, 19)
        ]
    },
    {
        "id": 4,
        "title": "Permanent Digital Proof",
        "tag": "SAFETY & TRUST",
        "text": "To guarantee complete integrity and shield honest officers from false allegations, GeM Audit cryptographically seals every single audit decision with SHA-256 digital stamps. This produces an unalterable forensic record that stands up in any court or vigilance inquiry.",
        "subtitles": [
            ("To guarantee integrity and shield honest officers from false allegations,", 0, 5),
            ("GeM Audit cryptographically seals every audit decision with SHA-256 digital stamps.", 5, 11),
            ("Produces an unalterable forensic record that stands up in any court or inquiry.", 11, 17)
        ]
    },
    {
        "id": 5,
        "title": "The 48-Hour Help Bot",
        "tag": "48-HOUR GeM DEADLINE",
        "text": "On the GeM portal, when officers raise technical queries, vendors have only forty-eight hours to respond or face automatic disqualification. Our AI clarifies everything in forty-five seconds—retrieving the exact verified certificates from their vault and drafting a formal, compliant representation on time.",
        "subtitles": [
            ("On GeM, vendors have only 48 hours to answer technical queries or face rejection.", 0, 6),
            ("Our AI clarifies everything in 45 seconds—retrieving verified certificates from their vault.", 6, 12),
            ("Drafts a formal, compliant representation on time, saving bids from disqualification.", 12, 18)
        ]
    },
    {
        "id": 6,
        "title": "Fast, Clean & Honest Bids",
        "tag": "NATIONAL IMPACT",
        "text": "GeM Audit slashes tender evaluation time from seven days down to just eight minutes—eliminating fake bids and saving thousands of crores. We are building a faster, smarter, and truly corruption-free public procurement ecosystem for India.",
        "subtitles": [
            ("Evaluation time slashed from 7 days down to just 8 minutes—96% faster.", 0, 5),
            ("Eliminating fake bids completely and saving thousands of crores.", 5, 10),
            ("Building a faster, smarter, and truly corruption-free procurement ecosystem for India.", 10, 16)
        ]
    }
]

def get_audio_duration(file_path):
    cmd = [FFMPEG, '-i', file_path]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output = res.stderr.decode('utf-8', errors='ignore')
    m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.\d+)', output)
    if m:
        h, mn, s = m.groups()
        return round(int(h) * 3600 + int(mn) * 60 + float(s), 1)
    return 18.0

async def generate_voice(voice_name, folder_name, rate="-2%", pitch="+0Hz"):
    out_dir = os.path.join(BASE_DIR, "frontend", "public", "audio", folder_name)
    root_dir = os.path.join(BASE_DIR, "audio", folder_name)
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(root_dir, exist_ok=True)

    print(f"\n[Voiceover] Generating Natural Human Voice using '{voice_name}' into '{folder_name}'...")
    durations = {}
    for item in VOICEOVERS:
        filename = f"scene{item['id']}.mp3"
        target_path = os.path.join(out_dir, filename)
        backup_path = os.path.join(root_dir, filename)

        # Edge-TTS with natural human pacing and subtle inflection
        comm = edge_tts.Communicate(item["text"], voice_name, rate=rate, pitch=pitch)
        await comm.save(target_path)
        shutil.copy2(target_path, backup_path)

        dur = get_audio_duration(target_path)
        durations[item["id"]] = dur
        print(f"  * Scene {item['id']}: {filename} | Duration: {dur}s | Size: {os.path.getsize(target_path)} bytes")
    return durations

async def main():
    # Primary Voice: en-IN-NeerjaExpressiveNeural (Ultra-realistic, expressive Indian female narrator)
    durations_primary = await generate_voice("en-IN-NeerjaExpressiveNeural", "pitch", rate="-2%", pitch="+0Hz")

    # Secondary Voice: en-IN-PrabhatNeural (Natural, confident, authoritative Indian male narrator)
    await generate_voice("en-IN-PrabhatNeural", "pitch_male", rate="-2%", pitch="+0Hz")

    print("\nSummary of Natural Audio Durations:")
    for scene_id, dur in durations_primary.items():
        print(f"  Scene {scene_id}: {dur} seconds")

if __name__ == "__main__":
    asyncio.run(main())
