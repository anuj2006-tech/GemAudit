import asyncio
import os
import edge_tts

VOICEOVERS = [
    {
        "id": 1,
        "text": "Every year, the government gives out lakhs of crores in contracts. But officers waste days checking piles of paper by hand. Dishonest bidders use fake certificates to win contracts, causing public projects to get delayed for years."
    },
    {
        "id": 2,
        "text": "Meet GeM Audit. Earlier, it took days of manual work, but with this, now our A.I. reads the bid documents and verifies all information against government portals in just three seconds. Right away, it catches two fake claims and warns the officer."
    },
    {
        "id": 3,
        "text": "Here is that live verification in action. In the bid document, the contractor claimed eighteen crore rupees in sales, but the government tax portal showed only four crore. The A.I. catches the lie instantly and prepares the rejection letter."
    },
    {
        "id": 4,
        "text": "To keep everything fair and protect officers from false blame, GeM Audit locks every decision with a secure digital stamp. This creates an unchangeable record that can be shown in court to prove everything was done honestly."
    },
    {
        "id": 5,
        "text": "On the government portal, if an officer asks for extra proof, sellers get only forty-eight hours to reply or their bid is rejected. Our A.I. finds the right past certificates in seconds and writes the reply letter for them, saving their bid on time."
    },
    {
        "id": 6,
        "text": "GeM Audit cuts tender checking time from seven days down to just eight minutes, stopping all fraud. We are making government buying fast, simple, and completely honest for India."
    }
]

async def main():
    import shutil
    # Output directory for frontend
    out_dir = os.path.join(os.path.dirname(__file__), "frontend", "public", "audio", "pitch")
    root_audio_dir = os.path.join(os.path.dirname(__file__), "audio", "pitch")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(root_audio_dir, exist_ok=True)
    
    # en-IN-NeerjaNeural: Natural, warm, studio-quality Indian English female narrator
    voice = "en-IN-NeerjaNeural"
    
    print(f"Generating studio voiceovers using {voice}...")
    for item in VOICEOVERS:
        filename = f"scene{item['id']}.mp3"
        out_path = os.path.join(out_dir, filename)
        root_path = os.path.join(root_audio_dir, filename)
        print(f"Generating {filename}...")
        communicate = edge_tts.Communicate(item["text"], voice, rate="-4%", pitch="+0Hz")
        await communicate.save(out_path)
        shutil.copy2(out_path, root_path)
        print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

    print("\nAll 6 scene voiceovers generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
