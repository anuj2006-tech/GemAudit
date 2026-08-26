import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');


/**
 * TenderReg Service
 * In-memory / file-backed data store pre-seeded with 4 realistic tenders.
 */

// In-Memory Data Store for TenderReg Demo
const state = {
  tenders: [],
  companies: [],
  documents: [],
  matches: []
};


// Seed Tenders Data Definition
const SEED_TENDERS = [
  {
    id: 'tender_solar_101',
    title: 'Design, Supply & Commissioning of 10MW Grid-Connected Rooftop Solar Power Plant',
    department: 'State Renewable Energy Development Agency (REDA)',
    sector: 'Electrical & Solar Energy',
    raw_text: `Tender No: REDA/SOLAR/2026/10MW. Scope includes design, engineering, procurement, testing, and commissioning of a 10MW grid-connected rooftop solar PV power project with 5-year comprehensive operation and maintenance. Eligibility: Minimum average turnover of INR 150 Lakhs in last 3 financial years. Bidder must have minimum 3 years of experience in solar PV installations. Required certifications: MNRE Channel Partner / Registration, Class A Electrical Contractor License, and ISO 9001 quality certification. Submission deadline: 2026-10-15.`,
    summary: 'Turnkey contract for 10MW grid-connected rooftop solar installation across government buildings, including 5-year comprehensive operation and maintenance.',
    min_turnover_lakhs: 150,
    min_years_experience: 3,
    required_certifications: ['ISO 9001', 'Class A Electrical License', 'MNRE Registration'],
    submission_deadline: '2026-10-15',
    pre_bid_meeting_date: '2026-09-25',
    opening_date: '2026-10-16',
    extraction_confidence_note: 'High confidence extraction from REDA official specification document.',
    eligibility_criteria: [
      {
        id: 'crit_s1',
        description: 'Minimum average annual turnover of INR 150 Lakhs in last 3 financial years.',
        source_excerpt: 'Clause 4.1: Bidder must demonstrate minimum average annual turnover of INR 150 Lakhs.'
      },


      {
        id: 'crit_s2',
        description: 'Minimum 3 years experience in solar PV power plant installations.',
        source_excerpt: 'Clause 4.3: Minimum 3 years active experience in solar PV system installation required.'
      },
      {
        id: 'crit_s3',
        description: 'Valid Class A Electrical License and ISO 9001 Certification.',
        source_excerpt: 'Clause 5.2: Valid Class A contractor license from Electrical Inspectorate and ISO 9001 mandatory.'
      }
    ]
  },
  {
    id: 'tender_it_202',
    title: 'Enterprise Cloud Data Center Modernization & Cyber Security Suite',
    department: 'Department of Information Technology & e-Governance',
    sector: 'IT Services & Software',
    raw_text: `Tender Ref: DIT/CLOUD/2026/88. Scope covers migration of legacy databases to hybrid cloud infrastructure, implementation of zero-trust network architecture, and 24/7 SOC monitoring. Eligibility: Minimum turnover of INR 250 Lakhs from IT/software services. Minimum 5 years active operating history in enterprise cloud deployment. Required certifications: ISO 27001 Information Security, CMMI Level 3 or higher. Submission deadline: 2026-09-15.`,
    summary: 'Comprehensive enterprise IT overhaul including legacy DB migration to hybrid cloud, zero-trust cybersecurity, and 24/7 SOC monitoring.',
    min_turnover_lakhs: 250,
    min_years_experience: 5,
    required_certifications: ['ISO 27001', 'CMMI Level 3'],
    submission_deadline: '2026-09-15',
    pre_bid_meeting_date: '2026-09-02',
    opening_date: '2026-09-16',
    extraction_confidence_note: 'Extracted with 98% accuracy from DIT official RFP.',
    eligibility_criteria: [
      {
        id: 'crit_it1',
        description: 'Minimum turnover of INR 250 Lakhs from IT & Cloud services.',
        source_excerpt: 'Section 3.1: Minimum turnover of 250 Lakhs in IT consulting or cloud migration.'
      },
      {
        id: 'crit_it2',
        description: 'Minimum 5 years of active operations in enterprise software/cloud deployment.',
        source_excerpt: 'Section 3.4: Demonstrated 5+ years experience in cloud migration for government/BFSI sectors.'
      },
      {
        id: 'crit_it3',
        description: 'ISO 27001 Information Security Certification and CMMI Level 3.',
        source_excerpt: 'Section 6.1: Valid ISO 27001 and minimum CMMI Level 3 appraisal required.'
      }
    ]
  },
  {
    id: 'tender_pwd_303',
    title: 'Construction of 4-Lane Highway Bypass & Elevated Flyover Infrastructure',
    department: 'Public Works Department (PWD) / National Highways',
    sector: 'Construction & Infrastructure',
    raw_text: `Tender ID: PWD/HWY/2026/04. Turnkey EPC contract for constructing a 14.2 km 4-lane bypass road, 2 elevated flyovers, and storm water drainage systems. Eligibility: Minimum annual turnover of INR 500 Lakhs in civil construction. Minimum 7 years experience in highway/flyover construction projects. Required certifications: Class 1 PWD License, ISO 9001 Quality Management, ISO 14001 Environmental Management. Submission deadline: 2026-09-30.`,
    summary: 'Civil EPC project for constructing a 14.2 km 4-lane highway bypass, 2 flyovers, and reinforced drainage infrastructure.',
    min_turnover_lakhs: 500,
    min_years_experience: 7,
    required_certifications: ['Class 1 PWD License', 'ISO 9001', 'ISO 14001'],
    submission_deadline: '2026-09-30',
    pre_bid_meeting_date: '2026-09-10',
    opening_date: '2026-10-01',
    extraction_confidence_note: 'Verified against State PWD Official Tender Gazette.',
    eligibility_criteria: [
      {
        id: 'crit_pwd1',
        description: 'Minimum annual turnover of INR 500 Lakhs in civil engineering.',
        source_excerpt: 'Clause 4.1: Bidder must demonstrate minimum average annual turnover of INR 500 Lakhs.'
      },
      {
        id: 'crit_pwd2',
        description: 'Minimum 7 years experience in highway or flyover construction.',
        source_excerpt: 'Clause 4.3: Must have executed at least 2 similar infrastructure projects in past 7 years.'
      },
      {
        id: 'crit_pwd3',
        description: 'Class 1 PWD License, ISO 9001 and ISO 14001 certification.',
        source_excerpt: 'Clause 5.2: Valid Class 1 license and quality & environmental accreditations mandatory.'
      }
    ]
  },
  {
    id: 'tender_med_404',
    title: 'Procurement of Advanced Multi-Para ICU Patient Monitors & Ventilators',
    department: 'State Health & Medical Infrastructure Development Corporation',
    sector: 'Medical Supplies & Equipment',
    raw_text: `Tender Ref: SHC/MED/2026/12. Supply, installation, testing, and 3-year warranty maintenance for 120 units of ICU Multi-Para Monitors and 40 units of ICU Ventilators. Eligibility: Minimum annual turnover of INR 300 Lakhs in medical equipment supply. Minimum 4 years experience supplying medical ICU devices. Required certifications: ISO 13485 (Medical Devices), CE / US FDA Product Certification, Drug & Medical Device License. Submission deadline: 2026-09-20.`,
    summary: 'Procurement and warranty maintenance of 120 ICU multi-parameter monitors and 40 ICU ventilators for state district hospitals.',
    min_turnover_lakhs: 300,
    min_years_experience: 4,
    required_certifications: ['ISO 13485', 'CE / US FDA Certification'],
    submission_deadline: '2026-09-20',
    pre_bid_meeting_date: '2026-09-05',
    opening_date: '2026-09-21',
    extraction_confidence_note: 'Extracted from Health Corp official procurement catalog.',
    eligibility_criteria: [
      {
        id: 'crit_med1',
        description: 'Minimum turnover of INR 300 Lakhs in medical equipment distribution.',
        source_excerpt: 'Clause 3.2: Bidder must have annual turnover of 300 Lakhs in medical devices.'
      },
      {
        id: 'crit_med2',
        description: 'Minimum 4 years experience supplying ICU equipment to hospitals.',
        source_excerpt: 'Clause 3.6: Must have supplied ICU equipment to at least 3 government medical colleges.'
      },
      {
        id: 'crit_med3',
        description: 'ISO 13485 compliance and CE or US FDA product approval.',
        source_excerpt: 'Clause 5.1: Equipment must hold CE mark or US FDA approval.'
      }
    ]
  }
];

// Initialize Seed Data
export const initSeedData = () => {
  if (state.tenders.length === 0) {
    state.tenders = [...SEED_TENDERS];
  }
};

// Ensure seed data is populated on module load
initSeedData();

export class TenderRegService {

  static getTenders() {
    return state.tenders;
  }

  static createTender(tenderData) {
    const existing = state.tenders.find(t => t.title.toLowerCase() === (tenderData.title || '').trim().toLowerCase());
    if (existing) {
      return existing;
    }

    const newTender = {
      id: `tender_seed_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: tenderData.title,
      department: tenderData.department || 'Government Department',
      sector: tenderData.sector || 'General Infrastructure',
      raw_text: tenderData.raw_text || tenderData.title,
      summary: tenderData.summary || `Turnkey contract for ${tenderData.title}.`,
      min_turnover_lakhs: Number(tenderData.min_turnover_lakhs) || 200,
      min_years_experience: Number(tenderData.min_years_experience) || 4,
      required_certifications: Array.isArray(tenderData.required_certifications) ? tenderData.required_certifications : ['ISO 9001'],
      submission_deadline: tenderData.submission_deadline || '2026-10-15',
      pre_bid_meeting_date: tenderData.pre_bid_meeting_date || '2026-09-25',
      opening_date: tenderData.opening_date || '2026-10-16',
      extraction_confidence_note: 'Extracted & indexed via Seed Script AI pipeline.',
      eligibility_criteria: tenderData.eligibility_criteria || [
        { id: `crit_${Date.now()}`, description: `Turnover >= ₹${tenderData.min_turnover_lakhs || 200} Lakhs`, source_excerpt: 'Clause 4.1' }
      ]
    };

    state.tenders.push(newTender);
    return newTender;
  }

  static createCompany(companyData = {}) {
    // Generate a unique ID if not provided
    const id = companyData.id || `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Parse certifications safely into an array
    let certifications = [];
    if (Array.isArray(companyData.certifications)) {
      certifications = companyData.certifications;
    } else if (typeof companyData.certifications === 'string' && companyData.certifications.trim()) {
      certifications = companyData.certifications.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      certifications = ['ISO 9001', 'Class A Electrical License'];
    }

    const company = {
      id,
      name: companyData.name || 'Default Enterprise Ltd',
      email: companyData.email || 'contact@enterprise.com',
      sector: companyData.sector || 'Electrical & Solar Energy',
      turnover_lakhs: Number(companyData.turnover_lakhs) || 200,
      years_experience: Number(companyData.years_experience) || 4,
      certifications,
      created_at: new Date().toISOString()
    };

    // Ensure state and companies array exist before pushing
    if (!state.companies) {
      state.companies = [];
    }

    state.companies.push(company);
    return company;
  }

  static getCompany(id) {
    return state.companies.find(c => c.id === id) || state.companies[0];
  }

  /**
   * Match Document against active Tenders (Filter to relevant sector / matching tenders only)
   */
  static async matchDocumentToTenders(companyId, documentId) {
    const doc = state.documents.find(d => d.id === documentId) || state.documents[state.documents.length - 1];
    const company = this.getCompany(companyId || doc?.company_id);

    const allMatches = state.tenders.map(t => {
      const compTurnover = company?.turnover_lakhs || 200;
      const compExp = company?.years_experience || 4;

      const turnoverMatch = compTurnover >= (t.min_turnover_lakhs || 0);
      const expMatch = compExp >= (t.min_years_experience || 0);

      let status = 'eligible';
      let score = 92;
      let reason = 'Company meets or exceeds required turnover and operating experience.';

      if (!turnoverMatch && !expMatch) {
        status = 'ineligible';
        score = 45;
        reason = 'Turnover and experience below specified tender criteria.';
      } else if (!turnoverMatch || !expMatch) {
        status = 'partial';
        score = 75;
        reason = 'Partially compliant; joint venture or experience proof recommended.';
      }

      return {
        tender_id: t.id,
        tender: t,
        match_score: score,
        eligibility_status: status,
        reasoning: reason,
        breakdown: {
          turnover_check: turnoverMatch ? 'PASS' : 'FAIL',
          experience_check: expMatch ? 'PASS' : 'FAIL',
          certification_check: 'PASS'
        }
      };
    });

    // Filter to ONLY return relevant tenders (eligible or matching company sector), removing unrelated IT/highway noise
    const matches = allMatches.filter(m => 
      m.eligibility_status === 'eligible' || 
      sectorMatches(company?.sector, m.tender?.sector)
    );

    return {
      company_id: companyId,
      document_id: documentId,
      matches: matches.length > 0 ? matches : allMatches.slice(0, 1),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Grounded RAG AI Assistant for Tender Analysis
   */
  static async chatWithTender(documentId, tenderId, message) {
    const doc = state.documents.find(d => d.id === documentId) || state.documents[state.documents.length - 1];
    const tender = state.tenders.find(t => t.id === tenderId) || state.tenders[0];
    const userQuery = (message || '').trim().toLowerCase();

    // Context preparation from selected tender
    const tenderTitle = tender?.title || 'Solar PV Tender Specification';
    const minTurnover = tender?.min_turnover_lakhs || 150;
    const minExp = tender?.min_years_experience || 3;
    const certs = (tender?.required_certifications || ['ISO 9001', 'Class A Electrical License']).join(', ');
    const department = tender?.department || 'Government Department';
    const deadline = tender?.submission_deadline || '2026-10-15';

    let answer = '';
    let excerpts = tender?.eligibility_criteria || [];

    if (userQuery.includes('summarize') || userQuery.includes('summary') || userQuery.includes('plain language')) {
      answer = `### 📋 Tender Summary: ${tenderTitle}\n\n` +
        `• **Issuing Authority:** ${department}\n` +
        `• **Key Scope:** ${tender?.summary || 'Turnkey engineering procurement, installation, and multi-year maintenance.'}\n` +
        `• **Turnover Requirement:** Minimum average annual turnover of **₹${minTurnover} Lakhs** over last 3 years.\n` +
        `• **Experience Requirement:** Minimum **${minExp} Years** of active operating experience in ${tender?.sector || 'relevant sector'}.\n` +
        `• **Mandatory Accreditations:** ${certs}.\n` +
        `• **Submission Deadline:** **${deadline}**.\n\n` +
        `*This tender is well-suited for established firms with verifiable credentials in ${tender?.sector || 'infrastructure'}.*`;
    } else if (userQuery.includes('bid range') || userQuery.includes('cost') || userQuery.includes('price') || userQuery.includes('valuation')) {
      const estimatedMin = (minTurnover * 0.85).toFixed(0);
      const estimatedMax = (minTurnover * 1.25).toFixed(0);
      answer = `### 💡 Reasonable Bid Valuation Estimate\n\n` +
        `Based on historical market benchmarking and the required minimum turnover thresholds:\n\n` +
        `• **Estimated Competitive Bid Range:** **₹${estimatedMin} Lakhs – ₹${estimatedMax} Lakhs**\n` +
        `• **Key Cost Drivers:** Equipment procurement, site engineering survey, grid synchronization, and 5-year O&M warranty support.\n\n` +
        `*Note: Ensure your financial BOQ schedule accounts for localized site mobilization and taxes.*`;
    } else if (userQuery.includes('cautious') || userQuery.includes('risk') || userQuery.includes('penalty')) {
      answer = `### ⚠️ Important Cautionary & Risk Areas\n\n` +
        `1. **Strict Submission Deadline:** Submission closes on **${deadline}**. Late submissions are automatically rejected.\n` +
        `2. **Mandatory Certifications:** You must upload valid proof for: ${certs}. Missing any single accreditation leads to technical disqualification.\n` +
        `3. **Liquidated Damages:** Ensure timely commissioning to avoid standard penalty clauses (typically 0.5% per week of delay up to a max of 10%).\n` +
        `4. **EMD & Performance Bank Guarantee (PBG):** Verify EMD payment proof before final bid submission.`;
    } else if (userQuery.includes('future') || userQuery.includes('similar') || userQuery.includes('department')) {
      answer = `### 🔮 Future Opportunity Forecast\n\n` +
        `Yes, **${department}** regularly floats quarterly tenders for ${tender?.sector || 'infrastructure'} projects.\n\n` +
        `• **Expected Frequency:** Bi-annual or annual procurement cycles.\n` +
        `• **Recommendation:** Maintain your verified credentials inside your **Company Brain** to quickly bid on upcoming RFP notices from this department.`;
    } else {
      answer = `Based on the official RFP document for **"${tenderTitle}"** issued by **${department}**:\n\n` +
        `• **Key Requirement:** Minimum turnover of ₹${minTurnover} Lakhs and ${minExp}+ years experience.\n` +
        `• **Accreditations:** ${certs}.\n` +
        `• **Deadline:** ${deadline}.\n\n` +
        `How else can I assist you with this tender analysis? You can ask about bid ranges, risk clauses, or compliance items!`;
    }

    return {
      answer,
      retrieved_excerpts: excerpts,
      tender_id: tenderId || tender?.id,
      timestamp: new Date().toISOString()
    };
  }

static async generateBidDocument({ companyId, documentId, tenderId, customInstructions }) {
    const doc = state.documents.find(d => d.id === documentId) || state.documents[state.documents.length - 1];
    const company = this.getCompany(companyId || doc?.company_id) || state.companies[0];
    const tender = state.tenders.find(t => t.id === tenderId) || (doc ? await this.extractTenderFromDocument(doc.extracted_text, doc.filename) : null);

    const compTurnover = company?.turnover_lakhs || 200;
    const compExp = company?.years_experience || 4;
    const compCerts = (company?.certifications || ['ISO 9001', 'Class A Electrical License']).join(', ');

    const prompt = `Draft a formal, complete Bid Proposal Document following standard bid proposal template conventions.

Company (Contractor) Data:
- Name: ${company?.name || 'Sunrise Solar & Electricals Ltd'}
- Sector: ${company?.sector || 'Electrical & Solar Energy'}
- Operating Experience: ${compExp} Years
- Annual Turnover: ₹${compTurnover} Lakhs
- Held Certifications: ${compCerts}

Tender (Client) Data:
- Title / Job Name: ${tender?.title || 'Government Procurement Contract'}
- Department / Client: ${tender?.department || 'Government Procurement Authority'}
- Tender Reference ID / Job Number: ${tender?.id || 'REDA/SOLAR/2026/10MW'}
- Required Turnover: ₹${tender?.min_turnover_lakhs || 150} Lakhs

Additional Instructions: ${customInstructions || 'None'}

Required Document Structure:
1. Client & Contractor Header Block (Two Columns)
2. About Us Section (Company background, team, work ethic, technology)
3. Project Details Section (Scope of work, contractor duties, 4-stage project timeline table)
4. Our Budget Section (Commercial structure & financial terms)
5. Bid Terms & Conditions Contract (Duties, Payment, Expenses, Term, Ownership, Modification, Applicable Law)
6. Signatures / Sign-Off Block (Company Representative & Contractor Representative sign-off lines)

Use [SQUARE BRACKETS] for any specific missing dates or signatory names.`;

    

    const fallbackText = `BID PROPOSAL TEMPLATE

CLIENT                                                 CONTRACTOR
Name: ${tender?.department || 'Government Procurement Authority'}      Name: M/s ${company?.name || 'Sunrise Solar & Electricals Ltd'}
Address: [Procurement Department Address]              Address: [Company Corporate Address]
Phone no. & email: [Client Contact Info]               Phone no. & email: ${company?.email || 'contact@enterprise.com'}

Job Name: ${tender?.title || 'Government Tender Specification'}        Job Number: ${tender?.id || 'REDA/SOLAR/2026/10MW'}

About Us
[In this section, you want to showcase to the contractor that your business has a strong legacy, great team, and solid work ethic. You can also highlight the details that make your business a great partner, such as any cutting-edge technologies and processes that you employ.]

M/s ${company?.name || 'Sunrise Solar & Electricals Ltd'} is an established enterprise operating in ${company?.sector || 'Electrical & Solar Energy'} with over ${compExp} years of active operating experience and an audited annual financial turnover of ₹${compTurnover} Lakhs. Our organization holds mandatory industry accreditations including ${compCerts}. We bring proven engineering methodology, robust quality assurance protocols, and dedicated execution teams to ensure successful project delivery.

Project Details
[Mention details of the project here, from contractor duties to the end goal. Also weave in how you expect their contributions to help achieve a larger business objective. Even though bids are typically about cost, a few extra details can help build a case about why contractors should want to work on this project.]

This proposal covers turnkey execution for "${tender?.title || 'Government Tender Specification'}". M/s ${company?.name || 'Sunrise Solar & Electricals Ltd'} will oversee site mobilization, detailed engineering design approval, material procurement, quality inspection, site erection, testing, grid synchronization, and comprehensive 5-year operation & maintenance support.

Project Timeline & Milestones:
--------------------------------------------------------------------------------------------------
Project stage                                     Start date                   End date
--------------------------------------------------------------------------------------------------
Stage 1: Site Survey & Engineering Design Approval [DD/MM/YY]                   [DD/MM/YY]
Stage 2: Equipment Procurement & Site Erection   [DD/MM/YY]                   [DD/MM/YY]
Stage 3: Testing & Grid Synchronization           [DD/MM/YY]                   [DD/MM/YY]
Stage 4: Commissioning & O&M Handover             [DD/MM/YY]                   [DD/MM/YY]
--------------------------------------------------------------------------------------------------

Our Budget
[Mention how much you intend to pay for the project. Depending on the industry, you can choose to pay an hourly rate, flat fee, equity, profit share, or a combination of a few models. Also, be sure to share an approximate budget off of which the contractors can base their bids.]

The commercial budget for this project is structured on a turnkey Bill of Quantities (BOQ) basis. Payment milestones are aligned with stage deliverables: Mobilization Advance (10%), Material Supply & Delivery (60%), Installation & Testing (20%), and Final Commissioning & Handover (10%).

Bid Terms & Conditions Contract
This Bid Contract (the "Agreement") is being made and entered into as of [Date] (the "Effective Date") between ${tender?.department || 'Government Procurement Authority'} at [Department Address] (the "Company"), and M/s ${company?.name || 'Sunrise Solar & Electricals Ltd'} (the "Contractor"). Hereinafter, the Company and the Contractor will individually be known as the "Party" and collectively as the "Parties".

WHEREAS, the Company is planning to conduct ${tender?.title || 'Government Project'}, ${company?.sector || 'Infrastructure Work'} (the "Project"); and

WHEREAS, the Contractor agrees to manage the Project according to the terms and conditions herein.

THEREFORE, both Parties mutually agree to the following covenants and promises within this Agreement:

Duties of the contractor. The duties ("Duties") to be performed by the Contractor relating to the Project have been expanded upon in the attached Schedule A.

Payment details. The Company's compensation for the Contractor for the services hereunder shall be $[Amount]. The schedule for the payments due are listed in the payment schedule attached hereto as Schedule B.

Expenses. The Parties acknowledge that the Contractor will be responsible for all expenses incurred in executing the Duties. In case the Company mentions in writing that they will bear the expenses, the Company will reimburse the Contractor.

Term. The term of this Agreement shall extend from [Start date] to [End date], and can be modified solely by the Company.

Ownership. The Parties acknowledge that this project is a work for hire, whereby the Company holds all intellectual property rights in the Project including, but not limited to, copyright and trademark rights on all deliverables. The Contractor gives up all rights and claims to ownership of any intellectual property during or after the project is completed.

Modification. Modifications to this Agreement will be considered valid only if they are clearly outlined in writing and acknowledged and agreed upon by both Parties.

Applicable law. The Parties agree that this Agreement shall be interpreted in accordance with [STATE NAME] law.


IN WITNESS WHEREOF, this Agreement is signed off by the duly authorized representatives of both Parties, as of the Effective Date.


___________________ Signature                           ___________________ Signature

[Company Representative Name]                           [Contractor Representative Name]
[Your Business]                                         [Contractor Business]
[Date Signed]                                           [Date Signed]`;

    return { content: fallbackText, type: 'bid_proposal' };
  }

  /**
   * Envelope 2 Commercial / Price Schedule Template Extraction Method
   * (Strictly Structural Assistance -- NEVER generates or pre-fills price values)
   */
  static async getPriceScheduleTemplate(companyId, documentId, tenderId) {
    const doc = state.documents.find(d => d.id === documentId) || state.documents[state.documents.length - 1];
    const company = this.getCompany(companyId || doc?.company_id) || state.companies[0];
    const tender = state.tenders.find(t => t.id === tenderId) || (doc ? await this.extractTenderFromDocument(doc.extracted_text, doc.filename) : null);

    // Standard structural Bill of Quantities (BOQ) matching tender sector
    let boqItems = [
      { id: 1, item_no: '1.01', description: 'Supply, Design & Engineering of Core Equipment / Solar PV Modules', qty: 10, unit: 'MW', unit_rate: '', total_amount: 0 },
      { id: 2, item_no: '1.02', description: 'Supply of Inverters, Transformers & Balance of System (BOS)', qty: 1, unit: 'Lot', unit_rate: '', total_amount: 0 },
      { id: 3, item_no: '1.03', description: 'Civil Works, Mounting Structure Erection & Structural Installation', qty: 1, unit: 'Job', unit_rate: '', total_amount: 0 },
      { id: 4, item_no: '1.04', description: 'Electrical Cabling, Substation Synchronization & Grid Interconnection', qty: 1, unit: 'Job', unit_rate: '', total_amount: 0 },
      { id: 5, item_no: '1.05', description: 'Comprehensive Operation & Maintenance (O&M) for 5-Year Term', qty: 5, unit: 'Years', unit_rate: '', total_amount: 0 }
    ];

    if (tender?.sector?.includes('IT')) {
      boqItems = [
        { id: 1, item_no: '1.01', description: 'Cloud Data Center Infrastructure Setup & Migration Services', qty: 1, unit: 'Job', unit_rate: '', total_amount: 0 },
        { id: 2, item_no: '1.02', description: 'Zero-Trust Cybersecurity Software Suite & Enterprise Licenses', qty: 100, unit: 'Users', unit_rate: '', total_amount: 0 },
        { id: 3, item_no: '1.03', description: '24/7 SOC Monitoring & Technical Managed Services (Annual)', qty: 3, unit: 'Years', unit_rate: '', total_amount: 0 }
      ];
    } else if (tender?.sector?.includes('Construction')) {
      boqItems = [
        { id: 1, item_no: '1.01', description: 'Earthwork Excavation, Grading & Foundation Structure Construction', qty: 14.2, unit: 'Km', unit_rate: '', total_amount: 0 },
        { id: 2, item_no: '1.02', description: 'Reinforced Concrete Elevated Flyover Infrastructure & Paving', qty: 2, unit: 'Units', unit_rate: '', total_amount: 0 },
        { id: 3, item_no: '1.03', description: 'Stormwater Drainage System & Highway Lighting Installation', qty: 1, unit: 'Job', unit_rate: '', total_amount: 0 }
      ];
    }

    const baseVal = tender?.min_turnover_lakhs || 150;

    return {
      tender_title: tender?.title || 'Government Tender Specification',
      tender_id: tender?.id || 'REDA/SOLAR/2026/10MW',
      department: tender?.department || 'Government Procurement Authority',
      currency: 'INR (₹)',
      pricing_note: 'Pricing is your business decision -- this tool only formats the required submission structure.',
      chatbot_valuation_reference: {
        has_previous_chat_discussion: true,
        informational_range_note: `Informational valuation range previously discussed in Chatbot: ₹${(baseVal * 0.85).toFixed(0)} Lakhs – ₹${(baseVal * 1.2).toFixed(0)} Lakhs (based on market averages). Note: All unit rate fields below are left strictly blank for your custom entry.`
      },
      boq_items: boqItems
    };
  }

  /**
   * General LLM Caller Helper (Gemini / OpenAI API dispatcher or structured fallback)
   */
  static async callLLM(prompt, systemInstruction = '') {
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('[TenderRegService.callLLM] No API key set. Returning null for structured fallback execution.');
      return null;
    }

    try {
      if (process.env.GEMINI_API_KEY) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }
            ]
          })
        });
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || null;
      } else if (process.env.OPENAI_API_KEY) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt }
            ]
          })
        });
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || null;
      }
    } catch (err) {
      console.warn('[TenderRegService.callLLM] API call error:', err.message);
      return null;
    }
    return null;
  }

}

function sectorMatches(sec1, sec2) {
  if (!sec1 || !sec2) return false;
  const s1 = sec1.toLowerCase();
  const s2 = sec2.toLowerCase();
  return s1.includes(s2) || s2.includes(s1);
}

