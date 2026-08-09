import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/common/PageHeader';
import { createTender, uploadTenderDocument } from '../../services/tenderService';
import { 
  ArrowLeft, FileText, UploadCloud, Trash2, Calendar, 
  MapPin, Building, Tag, DollarSign, RefreshCw, AlertCircle, Plus
} from 'lucide-react';

const DOCUMENT_TYPES = [
  'RFP',
  'Tender Notice',
  'BOQ',
  'Technical Specification',
  'Addendum',
  'Clarification',
  'Other'
];

const CreateTenderPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Metadata Form States
  const [formData, setFormData] = useState({
    title: '',
    reference_number: '',
    issuing_authority: '',
    category: '',
    location: '',
    publication_date: new Date().toISOString().split('T')[0],
    submission_deadline: '',
    estimated_value: '',
    description: ''
  });

  // Staged Documents States
  const [stagedFiles, setStagedFiles] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('RFP');
  const [uploadError, setUploadError] = useState('');

  // Submission Progress States
  const [loading, setLoading] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ---------------------------------------------------------
  // Staging Files Handlers
  // ---------------------------------------------------------

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      stageFile(e.target.files[0]);
    }
  };

  const stageFile = (file) => {
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds the 25MB limit.');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result.split(',')[1];
      
      const newStagedFile = {
        id: `staged_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        documentType: selectedDocType,
        mimeType: file.type || 'application/pdf',
        fileSize: file.size,
        base64: base64Data
      };

      setStagedFiles(prev => [...prev, newStagedFile]);
      setUploadError('');
    };
    reader.onerror = () => {
      setUploadError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const removeStagedFile = (id) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  // ---------------------------------------------------------
  // Form Submission
  // ---------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.reference_number || !formData.submission_deadline) {
      setErrorMsg('Please fill in all mandatory fields (Tender Title, Reference Number, and Submission Deadline).');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      
      // Step 1: Create Tender Workspace
      setProgressLabel('Creating tender workspace record...');
      const payload = {
        title: formData.title,
        reference_number: formData.reference_number,
        issuing_authority: formData.issuing_authority,
        category: formData.category,
        location: formData.location,
        publication_date: formData.publication_date ? new Date(formData.publication_date).toISOString() : null,
        submission_deadline: new Date(formData.submission_deadline).toISOString(),
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        description: formData.description,
        status: stagedFiles.length > 0 ? 'PROCESSING' : 'DRAFT'
      };

      const res = await createTender(payload);
      const tenderId = res.data.id;

      // Step 2: Upload staged documents
      for (let i = 0; i < stagedFiles.length; i++) {
        const file = stagedFiles[i];
        setProgressLabel(`Uploading document ${i + 1} of ${stagedFiles.length}: ${file.name}...`);
        await uploadTenderDocument(tenderId, {
          name: file.name,
          documentType: file.documentType,
          mimeType: file.mimeType,
          fileSize: file.fileSize,
          base64: file.base64
        });
      }

      setProgressLabel('Workspace created! Loading console...');
      setTimeout(() => {
        navigate(`/tenders/${tenderId}`);
      }, 1000);

    } catch (err) {
      console.error('Failed to create tender workspace:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to create workspace. Please try again.');
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <button 
          onClick={() => navigate('/tender-management')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Tender Management
        </button>
      </div>

      <PageHeader 
        title="📑 Create Tender Workspace" 
        subtitle="Establish a project-specific analysis vault. Input tender specifications and upload reference document sets (RFP, BOQs, specifications) to parse compliance items."
      />

      {errorMsg && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-xs font-semibold text-rose-300 flex items-center gap-3 mb-6">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="glow-card rounded-3xl p-12 text-center border border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
          <h3 className="text-lg font-bold text-white">Initializing Tender Workspace</h3>
          <p className="text-slate-400 text-xs animate-pulse">{progressLabel}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
          
          {/* Left panel: Metadata Form */}
          <div className="lg:col-span-7 glow-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800/80 bg-slate-950/20 shadow-2xl">
            <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
              Tender Specifications
            </h3>

            <div className="space-y-4">
              
              <div>
                <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                  Tender Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. NHAI Expressway CCTV Installation Project"
                  className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Reference Number <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleInputChange}
                    placeholder="e.g. NIT-1234/2026"
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Issuing Authority
                  </label>
                  <input 
                    type="text" 
                    name="issuing_authority"
                    value={formData.issuing_authority}
                    onChange={handleInputChange}
                    placeholder="e.g. NHAI, Municipal Corp"
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Category
                  </label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Networking"
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Location
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. New Delhi"
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Estimated Value (INR)
                  </label>
                  <input 
                    type="number" 
                    name="estimated_value"
                    value={formData.estimated_value}
                    onChange={handleInputChange}
                    placeholder="e.g. 150000000"
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Publication Date
                  </label>
                  <input 
                    type="date" 
                    name="publication_date"
                    value={formData.publication_date}
                    onChange={handleInputChange}
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                    Submission Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="submission_deadline"
                    value={formData.submission_deadline}
                    onChange={handleInputChange}
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold mb-1.5 font-mono">
                  Description
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Summary of tender scope and criteria..."
                  className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="btn-modern-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Create Tender Workspace
              </button>
            </div>
          </div>

          {/* Right panel: Staged Files */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* File Adder */}
            <div className="glow-card rounded-3xl p-6 border border-slate-800 bg-slate-950/40 shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                Stage Tender Documents
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1.5 font-mono">
                    Document Type
                  </label>
                  <select 
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl bg-slate-900 border border-slate-850 px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                  >
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div 
                  onClick={triggerFileSelect}
                  className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 bg-slate-900/20"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.txt"
                    className="hidden"
                  />

                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-white">Click to choose document</p>
                    <p className="text-[10px] text-slate-500 mt-1">Supports PDF & TXT up to 25MB</p>
                  </div>
                </div>

                {uploadError && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 p-3.5 flex items-center gap-2.5 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Staged List */}
            <div className="glow-card rounded-3xl p-6 border border-slate-800 bg-slate-950/40 shadow-2xl space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                Staged File Inventory
              </h3>

              {stagedFiles.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                  <p>No documents staged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stagedFiles.map(file => (
                    <div 
                      key={file.id}
                      className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-800 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-slate-800 text-slate-300">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">{file.name}</h4>
                          <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                            {formatBytes(file.fileSize)} • <span className="text-indigo-400">{file.documentType}</span>
                          </span>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeStagedFile(file.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </form>
      )}
    </DashboardLayout>
  );
};

export default CreateTenderPage;
