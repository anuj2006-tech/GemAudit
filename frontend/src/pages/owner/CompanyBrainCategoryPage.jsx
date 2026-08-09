import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { 
  getCompanyBrainCategoryDetails, 
  uploadCompanyBrainDocument, 
  deleteCompanyBrainDocument 
} from '../../services/companyBrainService';
import { 
  ArrowLeft, UploadCloud, FileText, CheckCircle2, AlertCircle, 
  RefreshCw, Trash2, Calendar, FileDown, Sparkles, Building, Briefcase, Award, BadgeCheck, HardDrive
} from 'lucide-react';

const CATEGORY_MAP = {
  company_profile: {
    title: 'Company Profile',
    desc: 'Basic organization attributes, established date, locations, and primary business areas.',
    factHeader: 'Basic Profile Facts',
    icon: Building
  },
  financial: {
    title: 'Financial Capability',
    desc: 'Audited revenues, net worth, working capital ratios, and credit histories.',
    factHeader: 'Verified Financial Audits',
    icon: Briefcase
  },
  experience: {
    title: 'Past Project Experience',
    desc: 'Record of successfully executed enterprise bids and government contracts.',
    factHeader: 'Project Execution Records',
    icon: Award
  },
  certification: {
    title: 'Certifications & Licenses',
    desc: 'Quality accreditations, MSME licenses, contractor registers, and active compliance certificates.',
    factHeader: 'Compliance Certifications',
    icon: BadgeCheck
  },
  technical: {
    title: 'Technical Capability',
    desc: 'Workforce sizes, key engineering skills, specialized machinery, and data center assets.',
    factHeader: 'Technical Capacity & Roster',
    icon: HardDrive
  }
};

const CompanyBrainCategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [documents, setDocuments] = useState([]);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Upload states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatusLabel, setUploadStatusLabel] = useState('');
  const [uploadError, setUploadError] = useState('');

  const config = CATEGORY_MAP[category] || { title: 'Capability Category', desc: '', icon: FileText, factHeader: 'Extracted Facts' };
  const CategoryIcon = config.icon;

  const loadCategoryData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await getCompanyBrainCategoryDetails(category);
      setDocuments(res.data.documents || []);
      setFacts(res.data.facts || []);
    } catch (err) {
      console.error('Failed to load category brain details:', err);
      setError('Could not connect to API. Showing local fallback sandbox data.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryData();
  }, [category]);

  // Dynamic status polling if documents are in pending/processing state
  useEffect(() => {
    const activeProcessing = documents.some(d => d.processing_status === 'pending' || d.processing_status === 'processing');
    if (!activeProcessing) return;

    const interval = setInterval(() => {
      loadCategoryData(false); // poll without main loading spinner
    }, 2000);

    return () => clearInterval(interval);
  }, [documents]);

  // ---------------------------------------------------------
  // File Upload Handlers
  // ---------------------------------------------------------
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    // Basic validations
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds the 25MB limit.');
      return;
    }
    
    setUploadError('');
    uploadFile(file);
  };

  const uploadFile = (file) => {
    setUploading(true);
    setUploadStatusLabel('Uploading document...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target.result.split(',')[1];
        
        setUploadStatusLabel('Processing and extracting facts...');
        
        await uploadCompanyBrainDocument({
          name: file.name,
          category,
          mimeType: file.type || 'application/pdf',
          fileSize: file.size,
          base64: base64Data
        });

        setUploadStatusLabel('Completed');
        // Let it poll to show complete status
        loadCategoryData(false);
      } catch (err) {
        console.error('Upload failed:', err);
        setUploadError(err.response?.data?.error || 'Document upload and parsing failed. Please try again.');
      } finally {
        setUploading(false);
        setUploadStatusLabel('');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document and all its extracted facts?')) return;
    try {
      await deleteCompanyBrainDocument(docId);
      loadCategoryData(false);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete document.');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // ---------------------------------------------------------
  // Fact Card Renderers
  // ---------------------------------------------------------

  const renderFactContent = (fact) => {
    const val = fact.fact_value;
    
    // Formatting helper for currency/numbers
    const formatValue = (v) => {
      if (!v) return 'N/A';
      if (!isNaN(v) && v.length > 5) {
        // Assume Crore/Lakh formatting if currency is INR
        const num = Number(v);
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`;
        return num.toLocaleString();
      }
      return v;
    };

    if (fact.fact_type === 'project') {
      const meta = fact.metadata || {};
      return (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Client:</span>
            <span className="font-bold text-white">{meta.client || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Project Value:</span>
            <span className="font-bold text-orange-400 font-mono">
              {meta.value ? formatValue(meta.value) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Year:</span>
            <span className="font-bold text-white">{meta.year || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className={`font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded ${
              meta.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>{meta.status || 'N/A'}</span>
          </div>
        </div>
      );
    }

    if (fact.fact_type === 'certification') {
      const meta = fact.metadata || {};
      return (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Issuer:</span>
            <span className="font-bold text-white">{meta.issuer || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Expires:</span>
            <span className="font-bold text-white font-mono">{meta.expiry_date || meta.valid_until || 'N/A'}</span>
          </div>
        </div>
      );
    }

    if (fact.fact_type === 'manpower') {
      const meta = fact.metadata || {};
      return (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Employee Count:</span>
            <span className="font-bold text-white font-mono">{meta.count || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Avg. Experience:</span>
            <span className="font-bold text-white font-mono">{meta.average_experience_years || 'N/A'} years</span>
          </div>
        </div>
      );
    }

    // Default facts (turnovers, basic profile attributes, locations etc.)
    return (
      <div className="space-y-1">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Extracted Value</span>
        <p className="text-lg font-extrabold text-white tracking-tight leading-none font-mono">
          {fact.fact_type.includes('turnover') || fact.fact_type.includes('worth') || fact.fact_type.includes('capital') 
            ? formatValue(val) 
            : val || 'N/A'}
        </p>
      </div>
    );
  };

  const getSourceFileName = (docId) => {
    const doc = documents.find(d => d.id === docId);
    return doc ? doc.file_name : 'Uploaded Document';
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <button 
          onClick={() => navigate('/company-brain')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Company Brain
        </button>
      </div>

      <PageHeader 
        title={config.title} 
        subtitle={config.desc}
        action={
          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border bg-slate-900 border-slate-800 text-indigo-400`}>
            <CategoryIcon className="h-5 w-5" />
          </div>
        }
      />

      {error && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs font-semibold text-amber-300 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Syncing capability category...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* Left panel: Upload Area & Documents list */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Upload Zone */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                Upload Category Evidence
              </h3>

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  isDragOver 
                    ? 'border-orange-500 bg-orange-500/5' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt"
                  className="hidden"
                />

                <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <UploadCloud className="h-5 w-5" />
                </div>
                
                <div>
                  <p className="text-xs font-bold text-white">Drag & drop compliance file here</p>
                  <p className="text-[10px] text-slate-500 mt-1">Supports PDF & TXT up to 25MB</p>
                </div>
              </div>

              {/* Status Labels */}
              {(uploading || uploadStatusLabel) && (
                <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/20 p-3.5 flex items-center gap-3 text-xs">
                  <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />
                  <span className="font-semibold text-slate-300 animate-pulse">{uploadStatusLabel}</span>
                </div>
              )}

              {uploadError && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3.5 flex items-center gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Documents List */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                Uploaded Evidence Documents
              </h3>

              {documents.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p>No documents uploaded in this category yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map(doc => {
                    const isProcessing = doc.processing_status === 'pending' || doc.processing_status === 'processing';
                    return (
                      <div 
                        key={doc.id}
                        className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-800 transition flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                            doc.processing_status === 'completed' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : isProcessing 
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-white truncate">{doc.file_name}</h4>
                            <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                              {formatBytes(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {doc.processing_status === 'completed' ? (
                            <span className="text-[9px] font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                              Processed
                            </span>
                          ) : isProcessing ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase animate-pulse">
                              <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                              Analysing
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase">
                              Failed
                            </span>
                          )}

                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Delete file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Extracted Facts */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-400" />
                    {config.factHeader}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Structured facts extracted from documents. Verified as eligibility criteria evidence.</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  {facts.length} Fact{facts.length === 1 ? '' : 's'}
                </span>
              </div>

              {facts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <Sparkles className="h-10 w-10 text-slate-700 mx-auto mb-3 animate-pulse" />
                  <p className="font-semibold text-slate-400">No capability facts extracted.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Upload files in the left panel to populate company capabilities.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facts.map(fact => (
                    <div 
                      key={fact.id}
                      className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between hover:border-slate-800 transition-all duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">
                            {fact.fact_type.replace('_', ' ')}
                          </span>
                        </div>
                        {renderFactContent(fact)}
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="truncate pr-2">Ref: {getSourceFileName(fact.document_id)}</span>
                        <Calendar className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default CompanyBrainCategoryPage;
