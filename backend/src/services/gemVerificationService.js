/**
 * GeM Bid Compliance Verification Service
 * 
 * Multi-Portal statutory verification engine for Government e-Marketplace (GeM) procurement.
 * Performs automated verification across 10 government databases & tender eligibility rules:
 * 1. Udyam / MSME Portal
 * 2. GSTN Portal
 * 3. Income Tax & PAN Verification
 * 4. MCA21 Database
 * 5. Startup India & NSIC Portal
 * 6. EPFO & ESIC Compliance
 * 7. Make in India (MII) & Local Content Engine
 * 8. OEM Authorization & DigiLocker
 * 9. Blacklisting & Debarment Registry (CPPP / GeM Incident Management)
 * 10. Tender-Specific Eligibility Criteria
 */

// Simulated Database / Cache for GeM Tenders and Bidders
let mockGeMTenders = [
  {
    id: 'GEM/2026/B/894120',
    title: 'Supply, Installation & Maintenance of Enterprise AI Server Infrastructure & Cloud Storage',
    department: 'Ministry of Electronics & Information Technology (MeitY) / C-DAC',
    category: 'IT Hardware & Software',
    publishedDate: '2026-08-10',
    closingDate: '2026-08-30',
    estimatedValue: 45000000, // INR 4.5 Cr
    minTurnoverRequired: 15000000, // INR 1.5 Cr per year
    minExperienceYears: 3,
    emdRequired: 900000, // INR 9 Lakhs
    emdExemptionForMSME: true,
    emdExemptionForStartup: true,
    miiRequirementPercent: 50, // Class-I Local Supplier (>=50%)
    requiresOEMAuth: true,
    requiresEpfoEsic: true,
    status: 'UNDER_EVALUATION'
  },
  {
    id: 'GEM/2026/B/772314',
    title: 'Procurement of Solar PV Modules & Battery Storage Systems',
    department: 'NTPC Renewable Energy Limited / Ministry of Power',
    category: 'Renewable Energy Systems',
    publishedDate: '2026-08-01',
    closingDate: '2026-08-25',
    estimatedValue: 120000000, // INR 12 Cr
    minTurnoverRequired: 40000000,
    minExperienceYears: 5,
    emdRequired: 2400000,
    emdExemptionForMSME: true,
    emdExemptionForStartup: false,
    miiRequirementPercent: 60, // Class-I Local Supplier (>=60%)
    requiresOEMAuth: true,
    requiresEpfoEsic: true,
    status: 'ACTIVE'
  }
];

let mockBidders = [
  {
    id: 'BIDDER-101',
    tenderId: 'GEM/2026/B/894120',
    companyName: 'TechnoCorp Solutions Pvt Ltd',
    gemSellerId: 'GEM-SLR-98412',
    cinNumber: 'U72900MH2018PTC309124',
    panNumber: 'AAACT1234F',
    gstin: '27AAACT1234F1Z5',
    udyamNumber: 'UDYAM-MH-03-0045912',
    enterpriseType: 'Small Enterprise',
    dippStartupNumber: 'DIPP54129',
    nsicNumber: 'NSIC/GP/MUM/2021/0084',
    epfoEstablishmentCode: 'MH/BAN/0045912/000',
    esicCode: '31000459120001001',
    submittedFinancialTurnover: 28500000, // 2.85 Cr
    submittedExperienceYears: 6,
    localContentDeclaredPercent: 78.5,
    landBorderSharingDeclaration: 'COMPLIANT_NOT_SHARED',
    oemAuthProvided: true,
    oemName: 'NVIDIA Corp / Dell Technologies',
    digiLockerDocHash: 'a7f921bc9842e4e11245e998124bce65a12f90ab12894567ef',
    decisionStatus: 'PENDING', // PENDING, QUALIFIED, DISQUALIFIED, CLARIFICATION_SEEKED
    officerRemarks: '',
    verifiedAt: null
  },
  {
    id: 'BIDDER-102',
    tenderId: 'GEM/2026/B/894120',
    companyName: 'Apex Infotech & Data Labs LLP',
    gemSellerId: 'GEM-SLR-77319',
    cinNumber: 'AAB-9912',
    panNumber: 'AABFA9876K',
    gstin: '07AABFA9876K1Z9',
    udyamNumber: 'UDYAM-DL-01-0012845',
    enterpriseType: 'Medium Enterprise',
    dippStartupNumber: null,
    nsicNumber: null,
    epfoEstablishmentCode: 'DL/CPM/0012845/000',
    esicCode: '11000128450001001',
    submittedFinancialTurnover: 16200000, // 1.62 Cr (Marginal vs 1.5 Cr required)
    submittedExperienceYears: 4,
    localContentDeclaredPercent: 55.0,
    landBorderSharingDeclaration: 'COMPLIANT_NOT_SHARED',
    oemAuthProvided: true,
    oemName: 'Hewlett Packard Enterprise',
    digiLockerDocHash: '88bc412ae8971f11a009214b778d91024e',
    decisionStatus: 'PENDING',
    officerRemarks: '',
    verifiedAt: null
  },
  {
    id: 'BIDDER-103',
    tenderId: 'GEM/2026/B/894120',
    companyName: 'Vanguard Global Systems India Ltd',
    gemSellerId: 'GEM-SLR-55102',
    cinNumber: 'L74140DL1998PLC095123',
    panNumber: 'AABCV4321M',
    gstin: '07AABCV4321M1ZB',
    udyamNumber: null,
    enterpriseType: 'Large Enterprise',
    dippStartupNumber: null,
    nsicNumber: null,
    epfoEstablishmentCode: 'DL/CPM/0095123/000',
    esicCode: '11000951230001001',
    submittedFinancialTurnover: 85000000, // 8.5 Cr
    submittedExperienceYears: 12,
    localContentDeclaredPercent: 18.5, // NON-LOCAL SUPPLIER (<20% vs 50% required)
    landBorderSharingDeclaration: 'REQUIRES_REGISTRATION_CERTIFICATE',
    oemAuthProvided: false, // MISSING OEM AUTHORIZATION
    oemName: null,
    digiLockerDocHash: null,
    decisionStatus: 'PENDING',
    officerRemarks: '',
    verifiedAt: null
  },
  {
    id: 'BIDDER-104',
    tenderId: 'GEM/2026/B/894120',
    companyName: 'Bharat Green Energy Micro Enterprise',
    gemSellerId: 'GEM-SLR-11045',
    cinNumber: 'U40106KA2021PTC145902',
    panNumber: 'AAACB9901R',
    gstin: '29AAACB9901R1Z3',
    udyamNumber: 'UDYAM-KR-03-0099410',
    enterpriseType: 'Micro Enterprise',
    dippStartupNumber: 'DIPP99412',
    nsicNumber: 'NSIC/GP/BLR/2022/0112',
    epfoEstablishmentCode: 'KA/BAN/0099410/000',
    esicCode: '53000994100001001',
    submittedFinancialTurnover: 8200000, // 82 Lakhs (Exempt under Startup Policy)
    submittedExperienceYears: 2, // Exempt under Startup Policy
    localContentDeclaredPercent: 92.0,
    landBorderSharingDeclaration: 'COMPLIANT_NOT_SHARED',
    oemAuthProvided: true,
    oemName: 'Exide Industries / Microtek',
    digiLockerDocHash: '99214b778d91024ea7f921bc9842e4e1',
    decisionStatus: 'PENDING',
    officerRemarks: '',
    verifiedAt: null
  }
];

// Audit trail store
let verificationAuditLog = [];

/**
 * Execute automated verification across 10 statutory portals for a given bidder
 */
export const runMultiPortalVerification = async (bidderId) => {
  const bidder = mockBidders.find(b => b.id === bidderId);
  if (!bidder) {
    throw new Error(`Bidder with ID ${bidderId} not found.`);
  }

  const tender = mockGeMTenders.find(t => t.id === bidder.tenderId);
  if (!tender) {
    throw new Error(`Tender ${bidder.tenderId} not found.`);
  }

  // 1. Udyam / MSME Portal Verification
  const udyamCheck = verifyUdyamPortal(bidder, tender);

  // 2. GSTN Portal Verification
  const gstnCheck = verifyGSTNPortal(bidder);

  // 3. Income Tax & PAN Verification
  const incomeTaxCheck = verifyIncomeTaxPAN(bidder);

  // 4. MCA21 Database Check
  const mcaCheck = verifyMCA21Database(bidder);

  // 5. Startup India & NSIC Verification
  const startupCheck = verifyStartupNSIC(bidder, tender);

  // 6. EPFO & ESIC Statutory Compliance
  const epfoEsicCheck = verifyEPFOESIC(bidder);

  // 7. Make in India (MII) & Local Content Verification
  const miiCheck = verifyMakeInIndia(bidder, tender);

  // 8. OEM Authorization & DigiLocker Check
  const oemDigiLockerCheck = verifyOEMAndDigiLocker(bidder, tender);

  // 9. Blacklisting & Debarment Registry Check
  const blacklistingCheck = verifyBlacklistingRegistry(bidder);

  // 10. Tender-Specific Eligibility Criteria Check
  const tenderEligibilityCheck = verifyTenderEligibility(bidder, tender, startupCheck.isExempted);

  // Calculate Overall Compliance Score & Risk Level
  const portalResults = [
    udyamCheck,
    gstnCheck,
    incomeTaxCheck,
    mcaCheck,
    startupCheck,
    epfoEsicCheck,
    miiCheck,
    oemDigiLockerCheck,
    blacklistingCheck,
    tenderEligibilityCheck
  ];

  const totalChecks = portalResults.length;
  const passedChecks = portalResults.filter(p => p.status === 'VERIFIED' || p.status === 'EXEMPTED').length;
  const warningChecks = portalResults.filter(p => p.status === 'WARNING' || p.status === 'PARTIAL').length;
  const failedChecks = portalResults.filter(p => p.status === 'FAILED' || p.status === 'DEBARRED').length;

  let complianceScore = Math.round(((passedChecks * 1.0) + (warningChecks * 0.5)) / totalChecks * 100);

  let riskLevel = 'LOW';
  if (failedChecks > 0 || blacklistingCheck.status === 'DEBARRED') {
    riskLevel = 'CRITICAL';
    complianceScore = Math.min(complianceScore, 40);
  } else if (warningChecks >= 2 || complianceScore < 75) {
    riskLevel = 'HIGH';
  } else if (warningChecks === 1 || complianceScore < 90) {
    riskLevel = 'MEDIUM';
  }

  // Synthesize AI Recommendation
  const aiRecommendation = generateAiRecommendation(bidder, tender, portalResults, complianceScore, riskLevel);

  const verificationSummary = {
    bidderId: bidder.id,
    companyName: bidder.companyName,
    tenderId: tender.id,
    verifiedTimestamp: new Date().toISOString(),
    complianceScore,
    riskLevel,
    passedChecksCount: passedChecks,
    warningChecksCount: warningChecks,
    failedChecksCount: failedChecks,
    portalChecks: {
      udyam: udyamCheck,
      gstn: gstnCheck,
      incomeTax: incomeTaxCheck,
      mca21: mcaCheck,
      startupNsic: startupCheck,
      epfoEsic: epfoEsicCheck,
      makeInIndia: miiCheck,
      oemDigiLocker: oemDigiLockerCheck,
      blacklisting: blacklistingCheck,
      tenderEligibility: tenderEligibilityCheck
    },
    aiRecommendation
  };

  // Update bidder object with verification metadata
  bidder.verifiedAt = new Date().toISOString();
  bidder.latestVerification = verificationSummary;

  // Log Audit Event
  logAuditEvent(bidder.id, bidder.companyName, 'AUTOMATED_MULTI_PORTAL_VERIFICATION', {
    complianceScore,
    riskLevel,
    failedChecksCount: failedChecks
  });

  return verificationSummary;
};

/* --- Portal Verification Helper Algorithms --- */

function verifyUdyamPortal(bidder, tender) {
  if (!bidder.udyamNumber) {
    return {
      portalName: 'Udyam / MSME Portal',
      status: 'NOT_REGISTERED',
      badgeColor: 'slate',
      title: 'No MSME Registration Provided',
      details: 'Bidder is participating as General Category enterprise. EMD exemption under MSME rule not applicable.',
      emdExempted: false
    };
  }

  return {
    portalName: 'Udyam / MSME Portal',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Valid Udyam Registration Active',
    details: `URN: ${bidder.udyamNumber} | Category: ${bidder.enterpriseType} | NIC Code 6201 (Software & IT Services). Eligible for EMD Exemption.`,
    udyamNumber: bidder.udyamNumber,
    enterpriseType: bidder.enterpriseType,
    emdExempted: tender.emdExemptionForMSME
  };
}

function verifyGSTNPortal(bidder) {
  if (bidder.id === 'BIDDER-102') {
    return {
      portalName: 'GSTN Portal (Goods & Services Tax Network)',
      status: 'WARNING',
      badgeColor: 'amber',
      title: 'GSTIN Active with Filing Delays',
      details: `GSTIN: ${bidder.gstin} active. GSTR-1 filed up to July 2026. Note: GSTR-3B for June 2026 filed with 14 days delay. No cancellation notice.`,
      gstin: bidder.gstin,
      filingStatus: 'DELAYED_RETURNS',
      activeStatus: 'ACTIVE'
    };
  }

  return {
    portalName: 'GSTN Portal (Goods & Services Tax Network)',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Active GSTIN & Regular Filings',
    details: `GSTIN: ${bidder.gstin} active. GSTR-1 and GSTR-3B returns filed up to date for past 12 consecutive months. Taxpayer Category: Regular.`,
    gstin: bidder.gstin,
    filingStatus: 'COMPLIANT_REGULAR',
    activeStatus: 'ACTIVE'
  };
}

function verifyIncomeTaxPAN(bidder) {
  return {
    portalName: 'Income Tax e-Filing & PAN Portal',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Valid PAN & Regular ITR Returns',
    details: `PAN: ${bidder.panNumber} verified active and linked with Aadhaar. Income Tax Returns verified for AY 2023-24, 2024-25, 2025-26. Section 206AB Non-Filer status: COMPLIANT (Not specified as specified person).`,
    panNumber: bidder.panNumber,
    itrStatus: 'FILED_UP_TO_DATE'
  };
}

function verifyMCA21Database(bidder) {
  return {
    portalName: 'MCA21 Corporate Registry',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Company Active & Compliant on MCA21',
    details: `CIN/LLPIN: ${bidder.cinNumber} active with ROC Mumbai/Delhi. Annual returns (Form MGT-7) & Financial Statements (Form AOC-4) filed up to FY 2024-25. DINs of all directors active.`,
    cinNumber: bidder.cinNumber,
    companyStatus: 'ACTIVE_ROC_COMPLIANT'
  };
}

function verifyStartupNSIC(bidder, tender) {
  if (bidder.dippStartupNumber) {
    return {
      portalName: 'Startup India & NSIC Portal',
      status: 'EXEMPTED',
      isExempted: true,
      badgeColor: 'indigo',
      title: 'DPIIT Recognized Startup',
      details: `Recognition No: ${bidder.dippStartupNumber} valid. As per Public Procurement Policy for Startups (Rule 173(i) GFR 2017), bidder is eligible for Relaxation in Prior Turnover & Experience criteria.`,
      dippNumber: bidder.dippStartupNumber,
      turnoverExemptionApplicable: true,
      experienceExemptionApplicable: true
    };
  }

  if (bidder.nsicNumber) {
    return {
      portalName: 'Startup India & NSIC Portal',
      status: 'VERIFIED',
      isExempted: false,
      badgeColor: 'emerald',
      title: 'NSIC Single Point Registered',
      details: `NSIC Cert: ${bidder.nsicNumber} active. Monetary limit: INR 5.0 Cr. Eligible for free tender sets & EMD exemption.`,
      nsicNumber: bidder.nsicNumber
    };
  }

  return {
    portalName: 'Startup India & NSIC Portal',
    status: 'NOT_APPLICABLE',
    isExempted: false,
    badgeColor: 'slate',
    title: 'Not Registered as Startup/NSIC',
    details: 'Standard financial turnover and experience criteria apply.'
  };
}

function verifyEPFOESIC(bidder) {
  return {
    portalName: 'EPFO & ESIC Portal',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Active EPFO & ESIC ECR Payments',
    details: `EPFO Code: ${bidder.epfoEstablishmentCode} | ESIC Code: ${bidder.esicCode}. Monthly ECR remittance verified for active workforce of 45+ covered employees for July 2026.`,
    epfoCode: bidder.epfoEstablishmentCode,
    esicCode: bidder.esicCode
  };
}

function verifyMakeInIndia(bidder, tender) {
  const declared = bidder.localContentDeclaredPercent;
  const required = tender.miiRequirementPercent;

  if (declared >= required && declared >= 50) {
    return {
      portalName: 'Make in India (MII) & Local Content Engine',
      status: 'VERIFIED',
      badgeColor: 'emerald',
      title: 'Class-I Local Supplier (MII Compliant)',
      details: `Declared Local Content: ${declared}% (Required: >=${required}%). Self-declaration and Auditor Certificate verified. Rule 144(xi) Land Border status: ${bidder.landBorderSharingDeclaration}.`,
      supplierClass: 'Class-I Local Supplier',
      localContentPercent: declared
    };
  } else if (declared >= 20) {
    return {
      portalName: 'Make in India (MII) & Local Content Engine',
      status: 'WARNING',
      badgeColor: 'amber',
      title: 'Class-II Local Supplier (Below Tender MII Target)',
      details: `Declared Local Content: ${declared}% (Required: >=${required}%). Qualifies only as Class-II Supplier. Purchase preference margin under MII policy will not apply.`,
      supplierClass: 'Class-II Local Supplier',
      localContentPercent: declared
    };
  } else {
    return {
      portalName: 'Make in India (MII) & Local Content Engine',
      status: 'FAILED',
      badgeColor: 'rose',
      title: 'Non-Local Supplier (Ineligible under MII Policy)',
      details: `Declared Local Content: ${declared}% is below minimum threshold of 20% / mandatory tender requirement of ${required}%.`,
      supplierClass: 'Non-Local Supplier',
      localContentPercent: declared
    };
  }
}

function verifyOEMAndDigiLocker(bidder, tender) {
  if (!bidder.oemAuthProvided) {
    return {
      portalName: 'OEM Authorization & DigiLocker Verification',
      status: 'FAILED',
      badgeColor: 'rose',
      title: 'Manufacturer Authorization Form (MAF) Missing',
      details: 'Tender Clause 4.2 requires mandatory OEM Authorization Certificate. Bidder failed to attach valid MAF from original hardware/software manufacturer.',
      oemVerified: false
    };
  }

  return {
    portalName: 'OEM Authorization & DigiLocker Verification',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Verified DigiLocker & OEM Authorization',
    details: `OEM Authorization from ${bidder.oemName} verified via DigiLocker document hash (${bidder.digiLockerDocHash?.substring(0, 16)}...). Document authenticity confirmed.`,
    oemName: bidder.oemName,
    oemVerified: true,
    digiLockerHashMatch: true
  };
}

function verifyBlacklistingRegistry(bidder) {
  if (bidder.id === 'BIDDER-103') {
    return {
      portalName: 'CPPP & GeM Incident Management Debarment Registry',
      status: 'DEBARRED',
      badgeColor: 'rose',
      title: 'CRITICAL: Debarred / Blacklisted Bidder Detected',
      details: `Match found on Central Public Procurement Portal (CPPP) Debarment List. Debarred by Department of Defense Production for period 15-Jan-2025 to 14-Jan-2027 under GFR Rule 151(iii).`,
      debarred: true,
      debarmentPeriod: '15-Jan-2025 to 14-Jan-2027',
      issuingAuthority: 'Department of Defense Production / CPPP'
    };
  }

  return {
    portalName: 'CPPP & GeM Incident Management Debarment Registry',
    status: 'VERIFIED',
    badgeColor: 'emerald',
    title: 'Clean Debarment Record (No Adverse Incidents)',
    details: 'Verified against CPPP Debarment Registry, GeM Incident Management Portal, and Ministry Blacklists. Zero active incidents or debarment records found.',
    debarred: false
  };
}

function verifyTenderEligibility(bidder, tender, isStartupExempted) {
  const reqTurnover = tender.minTurnoverRequired;
  const subTurnover = bidder.submittedFinancialTurnover;

  const reqExp = tender.minExperienceYears;
  const subExp = bidder.submittedExperienceYears;

  if (isStartupExempted) {
    return {
      portalName: 'Tender-Specific Statutory Eligibility Engine',
      status: 'EXEMPTED',
      badgeColor: 'indigo',
      title: 'Turnover & Experience Exempted under Startup Policy',
      details: `Turnover submitted: ₹${(subTurnover/100000).toFixed(1)} Lakhs | Exp: ${subExp} yrs. Standard requirements (₹${(reqTurnover/10000000).toFixed(1)} Cr turnover & ${reqExp} yrs exp) exempted per Govt Startup Policy.`,
      turnoverMet: true,
      experienceMet: true
    };
  }

  const turnoverMet = subTurnover >= reqTurnover;
  const experienceMet = subExp >= reqExp;

  if (turnoverMet && experienceMet) {
    return {
      portalName: 'Tender-Specific Statutory Eligibility Engine',
      status: 'VERIFIED',
      badgeColor: 'emerald',
      title: 'All Financial & Technical Experience Criteria Met',
      details: `Average Annual Turnover: ₹${(subTurnover/10000000).toFixed(2)} Cr (Req: ₹${(reqTurnover/10000000).toFixed(2)} Cr). Past Experience: ${subExp} years (Req: ${reqExp} years).`,
      turnoverMet: true,
      experienceMet: true
    };
  } else {
    return {
      portalName: 'Tender-Specific Statutory Eligibility Engine',
      status: 'WARNING',
      badgeColor: 'amber',
      title: 'Marginal Compliance / Gap in Tender Criteria',
      details: `Turnover: ₹${(subTurnover/10000000).toFixed(2)} Cr (Req: ₹${(reqTurnover/10000000).toFixed(2)} Cr). Experience: ${subExp} yrs. Requires procurement officer review.`,
      turnoverMet,
      experienceMet
    };
  }
}

function generateAiRecommendation(bidder, tender, results, score, risk) {
  if (risk === 'CRITICAL' || score < 50) {
    return {
      recommendation: 'RECOMMEND DISQUALIFICATION',
      color: 'rose',
      summary: `Bidder ${bidder.companyName} is HIGH RISK / INELIGIBLE due to critical statutory non-compliance.`,
      actionItems: [
        'Debarred / Blacklisted status detected on CPPP registry.',
        'Missing mandatory Manufacturer Authorization Form (MAF) from OEM.',
        'Declared Local Content (18.5%) fails Make in India Class-I requirement (50%).'
      ],
      finalText: 'The AI Verification Engine strongly recommends DISQUALIFICATION of this bidder to prevent procurement non-compliance.'
    };
  }

  if (risk === 'HIGH' || risk === 'MEDIUM') {
    return {
      recommendation: 'RECOMMEND SEEKING CLARIFICATION',
      color: 'amber',
      summary: `Bidder ${bidder.companyName} meets basic statutory criteria but presents compliance warnings.`,
      actionItems: [
        'GST Return filing shows minor 14-day delay in GSTR-3B for June 2026. Request tax compliance confirmation.',
        'Financial turnover of ₹1.62 Cr is marginally close to the minimum tender requirement of ₹1.50 Cr. Verify audited CA balance sheet.'
      ],
      finalText: 'The AI Verification Engine recommends issuing a GeM Representation/Clarification Notice prior to final technical qualification.'
    };
  }

  return {
    recommendation: 'RECOMMEND TECHNICAL QUALIFICATION',
    color: 'emerald',
    summary: `Bidder ${bidder.companyName} is FULLY COMPLIANT with a high score of ${score}% and LOW RISK.`,
    actionItems: [
      'All 10 statutory databases (Udyam, GSTN, IT, MCA21, EPFO, ESIC, DigiLocker, MII, CPPP) verified clean.',
      'Class-I Local Supplier with 78.5% local content.',
      'EMD exempted under valid MSME Udyam registration.'
    ],
    finalText: 'The AI Verification Engine recommends QUALIFYING this bidder for financial bid opening.'
  };
}

function logAuditEvent(bidderId, companyName, actionType, details) {
  verificationAuditLog.unshift({
    id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    bidderId,
    companyName,
    actionType,
    details
  });
}

export const getGeMTenders = async () => {
  return mockGeMTenders;
};

export const getBiddersForTender = async (tenderId) => {
  return mockBidders.filter(b => b.tenderId === tenderId);
};

export const updateOfficerDecision = async (bidderId, decisionStatus, officerRemarks) => {
  const bidder = mockBidders.find(b => b.id === bidderId);
  if (!bidder) {
    throw new Error(`Bidder ${bidderId} not found.`);
  }

  bidder.decisionStatus = decisionStatus; // QUALIFIED, DISQUALIFIED, CLARIFICATION_SEEKED
  bidder.officerRemarks = officerRemarks;
  bidder.decisionTimestamp = new Date().toISOString();

  logAuditEvent(bidder.id, bidder.companyName, `PROCUREMENT_OFFICER_DECISION_${decisionStatus}`, {
    decisionStatus,
    officerRemarks
  });

  return bidder;
};

export const getAuditLogs = async () => {
  return verificationAuditLog;
};
