#!/usr/bin/env python3
"""
Standalone Seed Script for TenderReg Backend
Populates the database/service with 5 realistic sample government tenders
reusing the existing backend tender creation logic and AI pipeline.

Usage:
  python seed_tenders.py
"""

import sys
import json
import urllib.request
import urllib.error

# Import SAMPLE_TENDERS list
try:
    from sample_tenders import SAMPLE_TENDERS
except ImportError:
    print("Error: Could not import SAMPLE_TENDERS from sample_tenders.py")
    sys.exit(1)

API_BASE_URL = "http://127.0.0.1:5000/api/tender-reg"

def fetch_existing_tenders():
    """Fetch existing tenders to avoid duplicate creations"""
    url = f"{API_BASE_URL}/tenders"
    req = urllib.request.Request(url, headers={"User-Agent": "TenderReg-Seeder/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                return data if isinstance(data, list) else []
    except Exception as err:
        print(f"Warning: Could not fetch existing tenders ({err}). Will attempt creation.")
    return []

def create_tender(tender_data):
    """Call existing backend tender creation pipeline endpoint"""
    url = f"{API_BASE_URL}/tenders"
    payload = json.dumps(tender_data).encode("utf-8")
    req = urllib.request.Request(
        url, 
        data=payload, 
        headers={
            "Content-Type": "application/json",
            "User-Agent": "TenderReg-Seeder/1.0"
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        if response.status in (200, 201):
            return json.loads(response.read().decode("utf-8"))
        else:
            raise Exception(f"HTTP Status {response.status}")

def main():
    print("=" * 65)
    print("Starting TenderReg Sample Government Tenders Seeding Pipeline")
    print("=" * 65)

    existing_tenders = fetch_existing_tenders()
    existing_titles = {t.get("title", "").strip().lower() for t in existing_tenders if t.get("title")}

    print(f"Found {len(existing_tenders)} existing tenders in system database.\n")

    total_count = len(SAMPLE_TENDERS)
    succeeded_count = 0
    skipped_count = 0
    failed_count = 0

    for idx, tender in enumerate(SAMPLE_TENDERS, start=1):
        title = tender.get("title", "").strip()
        print(f"[{idx}/{total_count}] Processing: '{title}'...")

        if title.lower() in existing_titles:
            print("   -> [SKIP] Tender already exists, skipping.\n")
            skipped_count += 1
            continue

        try:
            res = create_tender(tender)
            print("   -> [SUCCESS] Successfully created & indexed through AI pipeline.\n")
            succeeded_count += 1
            existing_titles.add(title.lower())
        except Exception as err:
            print(f"   -> [FAILED] Error seeding tender: {err}\n")
            failed_count += 1

    print("=" * 65)
    print("SEEDING COMPLETED SUMMARY")
    print("=" * 65)
    print(f"Total Tenders Processed : {total_count}")
    print(f"Successfully Created    : {succeeded_count}")
    print(f"Skipped (Already Exist) : {skipped_count}")
    print(f"Failed                  : {failed_count}")
    print("=" * 65)

if __name__ == "__main__":
    main()
