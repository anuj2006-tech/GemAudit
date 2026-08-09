import fs from 'fs';
import path from 'path';

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

  static createCompany(companyData) {
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const company = {
      id,
      name: companyData.name || 'Default Enterprise Ltd',
      email: companyData.email || 'contact@enterprise.com',
      sector: companyData.sector || 'Electrical & Solar Energy',
      turnover_lakhs: Number(companyData.turnover_lakhs) || 200,
      years_experience: Number(companyData.years_experience) || 4,
      certifications: Array.isArray(companyData.certifications) 
        ? companyData.certifications 
        : (companyData.certifications || 'ISO 9001, Class A Electrical License').split(',').map(s => s.trim()),
      created_at: new Date().toISOString()
    };
    state.companies.push(company);
    return company;
  }

  static getCompany(id) {
    return state.companies.find(c => c.id === id) || state.companies[0];
  }

  /**
   * Helper to perform LLM call via Gemini, OpenRouter, or OpenAI API
   */
  static async callLLM(prompt, systemInstruction = '') {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. Try Google Gemini API
    if (geminiKey) {
      try {
        const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: (systemInstruction ? systemInstruction + '\n\n' : '') + prompt }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            console.log('[LLM Engine] Successfully generated response via Google Gemini API');
            return text;
          }
        }
      } catch (err) {
        console.warn('[Gemini LLM Error]:', err.message);
      }
    }

    // 2. Try OpenRouter API
    if (openrouterKey) {
      try {
        const model = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openrouterKey}`,
            'HTTP-Referer': 'https://tender.ai',
            'X-Title': 'TenderReg AI Matcher'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemInstruction || 'You are an expert AI Tender Auditor and Evaluator.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const content = resData.choices?.[0]?.message?.content;
          if (content) {
            console.log('[LLM Engine] Successfully generated response via OpenRouter API');
            return content;
          }
        }
      } catch (err) {
        console.warn('[OpenRouter LLM Error]:', err.message);
      }
    }

    // 3. Try OpenAI API
    if (openaiKey) {
      try {
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemInstruction || 'You are an expert AI Tender Auditor and Evaluator.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const content = resData.choices?.[0]?.message?.content;
          if (content) {
            console.log('[LLM Engine] Successfully generated response via OpenAI API');
            return content;
          }
        }
      } catch (err) {
        console.warn('[OpenAI LLM Error]:', err.message);
      }
    }

    return null; // Return null if API call fails or is unconfigured
  }

  /**
   * Step 2: Upload document & generate analysis_summary
   */
  static async uploadDocument(companyId, fileData) {
    const company = this.getCompany(companyId);

    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const filename = fileData.filename || 'Company_Profile_Certificate.pdf';
    const rawText = fileData.text || fileData.extracted_text || `Company Profile for ${company?.name || 'Company'}. Established with ${company?.years_experience || 4} years experience. Annual turnover INR ${company?.turnover_lakhs || 200} Lakhs. Certifications held: ${(company?.certifications || []).join(', ')}. Completed major projects in solar and electrical power distribution.`;

    // 1. LLM Analysis Summary Generation
    let analysisSummary = '';
    const llmPrompt = `Analyze the following company profile document and write a concise 2-sentence summary detailing the company's verified capabilities, experience, turnover, and certifications.\n\nDocument Text:\n"${rawText}"`;
    const llmResponse = await this.callLLM(llmPrompt);

    if (llmResponse) {
      analysisSummary = llmResponse.trim();
    } else {
      // Robust deterministic fallback
      analysisSummary = `Verified document for ${company?.name || 'the company'}. Demonstrates ${company?.years_experience || 4}+ years operational experience, annual turnover of ₹${company?.turnover_lakhs || 200} Lakhs, and holds valid certifications: ${(company?.certifications || ['ISO 9001']).join(', ')}.`;
    }

    const document = {
      id: docId,
      company_id: companyId,
      filename,
      extracted_text: rawText,
      analysis_summary: analysisSummary,
      uploaded_at: new Date().toISOString()
    };

    state.documents.push(document);
    return document;
  }

  /**
   * Step 3: Match Document & Company Profile against all Tenders
   */
  static async matchDocumentToTenders(companyId, documentId) {
    const company = this.getCompany(companyId);
    const doc = state.documents.find(d => d.id === documentId) || state.documents[state.documents.length - 1];

    if (!doc) {
      throw new Error('Document not found.');
    }

    const matches = [];

    for (const tender of state.tenders) {
      // 1. Rule-Based Eligibility Check (Deterministic Python/JS logic)
      const turnoverOk = (company.turnover_lakhs || 0) >= (tender.min_turnover_lakhs || 0);
      const experienceOk = (company.years_experience || 0) >= (tender.min_years_experience || 0);
      
      const compCertsLower = (company.certifications || []).map(c => c.toLowerCase());
      const reqCerts = tender.required_certifications || [];
      const certsMatched = reqCerts.filter(rc => compCertsLower.some(cc => cc.includes(rc.toLowerCase()) || rc.toLowerCase().includes(cc)));
      const certsOk = certsMatched.length === reqCerts.length;

      let eligibilityStatus = 'eligible';
      const reasons = [];

      if (turnoverOk) {
        reasons.push(`Turnover (₹${company.turnover_lakhs}L) meets requirement (≥ ₹${tender.min_turnover_lakhs}L).`);
      } else {
        reasons.push(`Turnover (₹${company.turnover_lakhs}L) below minimum requirement (₹${tender.min_turnover_lakhs}L).`);
      }

      if (experienceOk) {
        reasons.push(`Experience (${company.years_experience} yrs) meets requirement (≥ ${tender.min_years_experience} yrs).`);
      } else {
        reasons.push(`Experience (${company.years_experience} yrs) below requirement (${tender.min_years_experience} yrs).`);
      }

      if (certsOk) {
        reasons.push(`Holds all required certifications (${reqCerts.join(', ')}).`);
      } else {
        reasons.push(`Missing certifications: ${reqCerts.filter(rc => !certsMatched.includes(rc)).join(', ') || 'Partial match'}.`);
      }

      if (turnoverOk && experienceOk && certsOk) {
        eligibilityStatus = 'eligible';
      } else if (turnoverOk || experienceOk || certsMatched.length > 0) {
        eligibilityStatus = 'partial';
      } else {
        eligibilityStatus = 'not_eligible';
      }

      // 2. LLM Match Score & Reasoning Generation
      let matchScore = 0;
      let reasoning = '';

      const matchPrompt = `Compare this Company Document Summary against the Tender Specifications and return a JSON object with keys "match_score" (number 0-100) and "reasoning" (2-3 sentences explaining fit).\n\nCompany Profile Summary:\n"${doc.analysis_summary}"\n\nTender Title: ${tender.title}\nTender Sector: ${tender.sector}\nTender Summary:\n"${tender.summary}"\n\nEligibility Status: ${eligibilityStatus.toUpperCase()}\nKey Reasons: ${reasons.join(' ')}\n\nRespond strictly with JSON format: { "match_score": number, "reasoning": "string" }`;

      const llmResultStr = await this.callLLM(matchPrompt, 'You are a JSON-only AI tender evaluation engine.');

      if (llmResultStr) {
        try {
          const jsonMatch = llmResultStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            matchScore = Number(parsed.match_score) || 75;
            reasoning = parsed.reasoning || '';
          }
        } catch (e) {
          console.warn('[JSON parse warning]:', e.message);
        }
      }

      // Fallback if LLM reasoning is empty or failed
      if (!reasoning) {
        if (eligibilityStatus === 'eligible') {
          matchScore = sectorMatches(company.sector, tender.sector) ? 92 : 82;
          reasoning = `${company.name} is a strong match for this ${tender.sector} tender. The company's turnover (₹${company.turnover_lakhs}L) and ${company.years_experience} years of experience fully satisfy all mandatory criteria.`;
        } else if (eligibilityStatus === 'partial') {
          matchScore = sectorMatches(company.sector, tender.sector) ? 62 : 48;
          reasoning = `${company.name} satisfies partial requirements for this project, but requires joint venture partnership to fulfill ${reasons.find(r => r.includes('below') || r.includes('Missing')) || 'specific criteria'}.`;
        } else {
          matchScore = 24;
          reasoning = `${company.name} does not currently meet mandatory minimum thresholds for turnover or core domain certifications specified by ${tender.department}.`;
        }
      }

      const matchObj = {
        id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        company_document_id: doc.id,
        tender_id: tender.id,
        tender,
        match_score: matchScore,
        match_reasoning: reasoning,
        eligibility_status: eligibilityStatus,
        eligibility_reasons: reasons.join(' ')
      };

      matches.push(matchObj);
      state.matches.push(matchObj);
    }

    // Sort descending by match_score
    matches.sort((a, b) => b.match_score - a.match_score);

    return {
      document: doc,
      company,
      matches
    };
  }
}

function sectorMatches(sec1, sec2) {
  if (!sec1 || !sec2) return false;
  const s1 = sec1.toLowerCase();
  const s2 = sec2.toLowerCase();
  return s1.includes(s2) || s2.includes(s1);
}
