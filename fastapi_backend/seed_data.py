import json
from sqlalchemy.orm import Session
from models import Bidder, MockGovRecord, Document, VerificationResult, ComplianceAssessment, AuditLog
from services.verification_engine import execute_full_verification

def seed_database(db: Session):
    # Check if database is already seeded with full dataset
    existing_bidders_count = db.query(Bidder).count()
    if existing_bidders_count >= 18:
        print(f"[Seed Data] Database already seeded with {existing_bidders_count} bidders.")
        return

    print("[Seed Data] Seeding 3 GeM Tenders & 18 realistic Indian bidders...")

    # Clear old records for clean re-seeding
    db.query(AuditLog).delete()
    db.query(ComplianceAssessment).delete()
    db.query(VerificationResult).delete()
    db.query(Document).delete()
    db.query(Bidder).delete()
    db.query(MockGovRecord).delete()
    db.commit()

    # 1. Seed Official Mock Government Database Records across 10 Portals
    mock_gov_records = [
        # Udyam MSME Registry Records
        MockGovRecord(portal_name="Udyam / MSME Portal", registration_number="UDYAM-KR-03-0019284", bidder_name="TechnoCorp Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"category": "Medium", "nic_code": "26201"})),
        MockGovRecord(portal_name="Udyam / MSME Portal", registration_number="UDYAM-DL-07-0082194", bidder_name="Apex Infotech & Data Labs LLP", status="ACTIVE", additional_fields_json=json.dumps({"category": "Small", "nic_code": "62011"})),
        MockGovRecord(portal_name="Udyam / MSME Portal", registration_number="UDYAM-MH-12-0044921", bidder_name="Bharat Green Energy Micro Enterprise", status="ACTIVE", additional_fields_json=json.dumps({"category": "Micro", "nic_code": "35106"})),
        MockGovRecord(portal_name="Udyam / MSME Portal", registration_number="UDYAM-RJ-04-0011928", bidder_name="Shree Balaji Industries", status="ACTIVE", additional_fields_json=json.dumps({"category": "Small", "renewal_date": "23-Aug-2026"})),
        MockGovRecord(portal_name="Udyam / MSME Portal", registration_number="UDYAM-KA-02-0099412", bidder_name="Coastal Engineering Works", status="ACTIVE", additional_fields_json=json.dumps({"category": "Medium", "nic_code": "28110"})),
        MockGovRecord(portal_name="Udyam / MSME Portal", registration_number="UDYAM-TN-01-0055123", bidder_name="Nexgen Infra Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"category": "Medium", "nic_code": "62090"})),

        # GSTN Tax Registry Records
        MockGovRecord(portal_name="GSTN Portal", registration_number="29AABCT1234F1Z5", bidder_name="TechnoCorp Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"filing_status": "Up-to-date", "jurisdiction": "Bengaluru East"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="07AABFA9876K1Z9", bidder_name="Apex Infotech & Data Labs LLP", status="DELAYED_RETURNS", additional_fields_json=json.dumps({"filing_status": "GSTR-3B June Delayed 14 days", "jurisdiction": "New Delhi Ward 45"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="27AABCV5544E1Z3", bidder_name="Vanguard Global Systems Ltd", status="ACTIVE", additional_fields_json=json.dumps({"filing_status": "Up-to-date", "jurisdiction": "Mumbai Central"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="27AABCB1122D1Z1", bidder_name="Bharat Green Energy Micro Enterprise", status="ACTIVE", additional_fields_json=json.dumps({"filing_status": "Up-to-date", "jurisdiction": "Pune Circle 2"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="08AABCS9988C1Z2", bidder_name="Shree Balaji Industries", status="ACTIVE", additional_fields_json=json.dumps({"filing_status": "Up-to-date", "jurisdiction": "Jaipur City"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="29AABCC4433B1Z4", bidder_name="Coastal Engineering Works", status="ACTIVE", additional_fields_json=json.dumps({"filing_status": "Up-to-date", "jurisdiction": "Mangaluru South"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="33AABCN7766A1Z6", bidder_name="Nexgen Infra Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"filing_status": "Up-to-date", "jurisdiction": "Chennai Central"})),
        MockGovRecord(portal_name="GSTN Portal", registration_number="27AABCS1111E1Z0", bidder_name="Swaraj Engineering Enterprise", status="CANCELLED", additional_fields_json=json.dumps({"filing_status": "Registration Cancelled Suo-Moto", "cancellation_date": "10-May-2026"})),

        # Income Tax & PAN Records
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABCT1234F", bidder_name="TechnoCorp Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed", "sec_206ab": "Compliant"})),
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABFA9876K", bidder_name="Apex Infotech Data Labs", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed", "name_on_pan": "Apex Infotech Data Labs"})),
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABCV5544E", bidder_name="Vanguard Global Systems Ltd", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed"})),
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABCB1122D", bidder_name="Bharat Green Energy Micro Enterprise", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed"})),
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABCS9988C", bidder_name="Shree Balaji Industries", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed"})),
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABCC4433B", bidder_name="Coastal Engineering Works", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed"})),
        MockGovRecord(portal_name="Income Tax & PAN Portal", registration_number="AABCN7766A", bidder_name="Nexgen Infra Solutions Private Limited", status="ACTIVE", additional_fields_json=json.dumps({"itr_status": "AY 2025-26 Filed"})),

        # MCA21 Corporate Registry Records
        MockGovRecord(portal_name="MCA21 Corporate Registry", registration_number="U72200KA2015PTC081234", bidder_name="TechnoCorp Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"roc": "ROC Bangalore", "annual_returns": "MGT-7 & AOC-4 Up-to-date"})),
        MockGovRecord(portal_name="MCA21 Corporate Registry", registration_number="AAB-9876", bidder_name="Apex Infotech & Data Labs LLP", status="ACTIVE", additional_fields_json=json.dumps({"roc": "ROC Delhi", "annual_returns": "Form 11 Up-to-date"})),
        MockGovRecord(portal_name="MCA21 Corporate Registry", registration_number="L74999MH2010PLC204432", bidder_name="Vanguard Global Systems Ltd", status="ACTIVE", additional_fields_json=json.dumps({"roc": "ROC Mumbai", "annual_returns": "MGT-7 Up-to-date"})),
        MockGovRecord(portal_name="MCA21 Corporate Registry", registration_number="U74999TN2018PTC099123", bidder_name="Nexgen Infra Solutions Pvt Ltd", status="ACTIVE", additional_fields_json=json.dumps({"roc": "ROC Chennai", "annual_returns": "Up-to-date"})),

        # Startup India Registry Records
        MockGovRecord(portal_name="Startup India Portal", registration_number="DIPP98765", bidder_name="Bharat Green Energy Micro Enterprise", status="ACTIVE", additional_fields_json=json.dumps({"valid_until": "15-Dec-2028", "category": "CleanTech / Green Energy"})),

        # CPPP Blacklist & Debarment Registry Records
        MockGovRecord(portal_name="CPPP Blacklist Registry", registration_number="27AABCV5544E1Z3", bidder_name="Vanguard Global Systems Ltd", status="DEBARRED", additional_fields_json=json.dumps({"debarment_reason": "Submission of forged OEM authorization letter in Tender DEF/2025/B/4412", "debarred_by": "Department of Defense Production", "period": "24 Months (Valid up to Nov 2027)"}))
    ]
    db.add_all(mock_gov_records)
    db.commit()

    # 2. Seed 18 Bidders across 3 Tenders

    # TENDER 1: Supply of Office Furniture (GEM/2026/B/894120)
    t1_bidders = [
        Bidder(
            gem_seller_id="GEM-SLR-90112",
            company_name="TechnoCorp Solutions Pvt Ltd",
            tender_ref="GEM/2026/B/894120",
            tender_name="Supply of Office Furniture",
            cin_number="U72200KA2015PTC081234",
            pan_number="AABCT1234F",
            gstin="29AABCT1234F1Z5",
            udyam_number="UDYAM-KR-03-0019284",
            enterprise_type="Medium",
            epfo_code="PYBOM1234567000",
            esic_code="31000123450000101",
            submitted_turnover=18.5,
            submitted_experience_years=8,
            local_content_percent=65.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-77319",
            company_name="Apex Infotech & Data Labs LLP",
            tender_ref="GEM/2026/B/894120",
            tender_name="Supply of Office Furniture",
            cin_number="AAB-9876",
            pan_number="AABFA9876K",
            gstin="07AABFA9876K1Z9",
            udyam_number="UDYAM-DL-07-0082194",
            enterprise_type="Small",
            epfo_code="DLCPM9876543000",
            esic_code="11000987650000102",
            submitted_turnover=6.2,
            submitted_experience_years=4,
            local_content_percent=55.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-33104",
            company_name="Vanguard Global Systems Ltd",
            tender_ref="GEM/2026/B/894120",
            tender_name="Supply of Office Furniture",
            cin_number="L74999MH2010PLC204432",
            pan_number="AABCV5544E",
            gstin="27AABCV5544E1Z3",
            udyam_number=None,
            enterprise_type="Large Enterprise",
            epfo_code="MHBAN5544332000",
            esic_code="33000554430000103",
            submitted_turnover=140.0,
            submitted_experience_years=14,
            local_content_percent=15.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-44910",
            company_name="Bharat Green Energy Micro Enterprise",
            tender_ref="GEM/2026/B/894120",
            tender_name="Supply of Office Furniture",
            cin_number=None,
            pan_number="AABCB1122D",
            gstin="27AABCB1122D1Z1",
            udyam_number="UDYAM-MH-12-0044921",
            enterprise_type="Micro",
            dipp_startup_number="DIPP98765",
            epfo_code="MHPUN1122334000",
            esic_code="33000112230000104",
            submitted_turnover=1.2,
            submitted_experience_years=2,
            local_content_percent=80.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-88192",
            company_name="Shree Balaji Industries",
            tender_ref="GEM/2026/B/894120",
            tender_name="Supply of Office Furniture",
            cin_number=None,
            pan_number="AABCS9988C",
            gstin="08AABCS9988C1Z2",
            udyam_number="UDYAM-RJ-04-0011928",
            enterprise_type="Small",
            epfo_code="RJJAP9988776000",
            esic_code="15000998870000105",
            submitted_turnover=4.5,
            submitted_experience_years=5,
            local_content_percent=60.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-22941",
            company_name="Coastal Engineering Works",
            tender_ref="GEM/2026/B/894120",
            tender_name="Supply of Office Furniture",
            cin_number=None,
            pan_number="AABCC4433B",
            gstin="29AABCC4433B1Z4",
            udyam_number="UDYAM-KA-02-0099412",
            enterprise_type="Medium",
            epfo_code="PYMNG4433221000",
            esic_code="31000443320000106",
            submitted_turnover=12.0,
            submitted_experience_years=7,
            local_content_percent=52.0, # Ambiguous local content
            decision_status="PENDING"
        )
    ]

    # TENDER 2: IT Hardware & Networking Equipment Procurement (GEM/2026/B/894287)
    t2_bidders = [
        Bidder(
            gem_seller_id="GEM-SLR-10923",
            company_name="Nexgen Infra Solutions Pvt Ltd",
            tender_ref="GEM/2026/B/894287",
            tender_name="IT Hardware & Networking Equipment Procurement",
            cin_number="U74999TN2018PTC099123",
            pan_number="AABCN7766A",
            gstin="33AABCN7766A1Z6",
            udyam_number="UDYAM-TN-01-0055123",
            enterprise_type="Medium",
            epfo_code="TNCHN7766554000",
            esic_code="51000776650000107",
            submitted_turnover=22.4,
            submitted_experience_years=9,
            local_content_percent=70.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-55419",
            company_name="Prime Facility Services LLP",
            tender_ref="GEM/2026/B/894287",
            tender_name="IT Hardware & Networking Equipment Procurement",
            cin_number="AAC-1122",
            pan_number="AABCP5544P",
            gstin="27AABCP5544P1Z8",
            udyam_number="UDYAM-MH-01-0011223",
            enterprise_type="Small",
            epfo_code="MHMUM5544112000",
            esic_code="33000554410000108",
            submitted_turnover=8.5,
            submitted_experience_years=6,
            local_content_percent=60.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-66231",
            company_name="Zenith Logistics India Ltd",
            tender_ref="GEM/2026/B/894287",
            tender_name="IT Hardware & Networking Equipment Procurement",
            cin_number="L63090DL2005PLC134567",
            pan_number="AABCZ6623Z",
            gstin="07AABCZ6623Z1Z2",
            udyam_number=None,
            enterprise_type="Large Enterprise",
            epfo_code="DLDEL6623114000",
            esic_code="11000662310000109",
            submitted_turnover=180.0,
            submitted_experience_years=15,
            local_content_percent=25.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-33821",
            company_name="Bharat Vikas Enterprises",
            tender_ref="GEM/2026/B/894287",
            tender_name="IT Hardware & Networking Equipment Procurement",
            cin_number=None,
            pan_number="AABCV3382V",
            gstin="09AABCV3382V1Z1",
            udyam_number="UDYAM-UP-08-0033821",
            enterprise_type="Medium",
            epfo_code="UPNOI3382115000",
            esic_code="21000338210000110",
            submitted_turnover=15.0,
            submitted_experience_years=7,
            local_content_percent=65.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-44109",
            company_name="Himalayan Tech Works",
            tender_ref="GEM/2026/B/894287",
            tender_name="IT Hardware & Networking Equipment Procurement",
            cin_number=None,
            pan_number="AABCH4410H",
            gstin="05AABCH4410H1Z3",
            udyam_number="UDYAM-UK-03-0044109",
            enterprise_type="Small",
            epfo_code="UKDEH4410996000",
            esic_code="16000441090000111",
            submitted_turnover=5.0,
            submitted_experience_years=4,
            local_content_percent=55.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-99234",
            company_name="Surya Solar Technologies Pvt Ltd",
            tender_ref="GEM/2026/B/894287",
            tender_name="IT Hardware & Networking Equipment Procurement",
            cin_number="U40106GJ2017PTC098765",
            pan_number="AABCS9923S",
            gstin="24AABCS9923S1Z5",
            udyam_number="UDYAM-GJ-01-0099234",
            enterprise_type="Small",
            epfo_code="GJAHM9923447000",
            esic_code="24000992340000112",
            submitted_turnover=9.8,
            submitted_experience_years=6,
            local_content_percent=75.0,
            decision_status="PENDING"
        )
    ]

    # TENDER 3: Facility Management Services - Annual Contract (GEM/2026/B/895011)
    t3_bidders = [
        Bidder(
            gem_seller_id="GEM-SLR-12399",
            company_name="Vidyut Controls & Automation",
            tender_ref="GEM/2026/B/895011",
            tender_name="Facility Management Services - Annual Contract",
            cin_number="U31900MH2012PTC234123",
            pan_number="AABCV1239V",
            gstin="27AABCV1239V1Z7",
            udyam_number="UDYAM-MH-15-0012399",
            enterprise_type="Medium",
            epfo_code="MHPUN1239998000",
            esic_code="33000123990000113",
            submitted_turnover=16.0,
            submitted_experience_years=8,
            local_content_percent=68.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-77812",
            company_name="Trident Data Systems Pvt Ltd",
            tender_ref="GEM/2026/B/895011",
            tender_name="Facility Management Services - Annual Contract",
            cin_number="U72900DL2016PTC298712",
            pan_number="AABCT7781T",
            gstin="07AABCT7781T1Z9",
            udyam_number="UDYAM-DL-02-0077812",
            enterprise_type="Small",
            epfo_code="DLDEL7781229000",
            esic_code="11000778120000114",
            submitted_turnover=7.4,
            submitted_experience_years=5,
            local_content_percent=58.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-88341",
            company_name="Swaraj Engineering Enterprise",
            tender_ref="GEM/2026/B/895011",
            tender_name="Facility Management Services - Annual Contract",
            cin_number=None,
            pan_number="AABCS8834S",
            gstin="27AABCS1111E1Z0", # Cancelled GSTIN
            udyam_number=None,
            enterprise_type="Small",
            epfo_code=None,
            esic_code=None,
            submitted_turnover=3.1,
            submitted_experience_years=3,
            local_content_percent=10.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-44512",
            company_name="Sahyadri Paper Products",
            tender_ref="GEM/2026/B/895011",
            tender_name="Facility Management Services - Annual Contract",
            cin_number=None,
            pan_number="AABCS4451P",
            gstin="27AABCS4451P1Z2",
            udyam_number="UDYAM-MH-20-0044512",
            enterprise_type="Micro",
            dipp_startup_number="DIPP44512",
            epfo_code="MHNAS4451221000",
            esic_code="33000445120000115",
            submitted_turnover=1.5,
            submitted_experience_years=2,
            local_content_percent=85.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-99012",
            company_name="Oceanic Tech Solutions",
            tender_ref="GEM/2026/B/895011",
            tender_name="Facility Management Services - Annual Contract",
            cin_number=None,
            pan_number="AABCO9901T",
            gstin="33AABCO9901T1Z4",
            udyam_number="UDYAM-TN-02-0099012",
            enterprise_type="Small",
            epfo_code="TNCHE9901222000",
            esic_code="51000990120000116",
            submitted_turnover=4.8,
            submitted_experience_years=4,
            local_content_percent=55.0,
            decision_status="PENDING"
        ),
        Bidder(
            gem_seller_id="GEM-SLR-33219",
            company_name="Kaveri Infra Projects",
            tender_ref="GEM/2026/B/895011",
            tender_name="Facility Management Services - Annual Contract",
            cin_number="U45200KA2014PTC076543",
            pan_number="AABCK3321K",
            gstin="29AABCK3321K1Z6",
            udyam_number="UDYAM-KA-01-0033219",
            enterprise_type="Medium",
            epfo_code="PYBLR3321993000",
            esic_code="31000332190000117",
            submitted_turnover=19.0,
            submitted_experience_years=9,
            local_content_percent=72.0,
            decision_status="PENDING"
        )
    ]

    all_bidders = t1_bidders + t2_bidders + t3_bidders
    db.add_all(all_bidders)
    db.commit()

    # 3. Execute Initial Verification Engine Run for all 18 Bidders
    for b in all_bidders:
        execute_full_verification(db, b.id)

    print(f"[Seed Data] Database successfully seeded with 3 Tenders & {len(all_bidders)} Bidders.")
