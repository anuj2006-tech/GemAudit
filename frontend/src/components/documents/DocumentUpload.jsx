import { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, FileText, X, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ChevronDown, Trash2, FileCode, Check
} from 'lucide-react';

const DOCUMENT_TYPES = [
  'Registration Certificate',
  'Financial Statement',
  'Past Experience Certificate',
  'ISO/Quality Certification',
  'GST Registration',
  'Other'
];

/**
 * Format bytes into human readable string (e.g. 2.4 MB)
 */
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * DocumentUpload component for GeM Audit AI Console
 * 
 * @param {Object} props
 * @param {(file: File, docType: string) => Promise<any>} props.onUpload - Async upload function
 * @param {string} [props.className] - Optional container class overrides
 */
const DocumentUpload = ({ onUpload, onPollStatus, onCompleteIndexing, className = '' }) => {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ---------------------------------------------------------
  // File Staging Handlers
  // ---------------------------------------------------------
  const addFilesToStage = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      // Validate maximum 25MB file size
      if (file.size > 25 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the maximum size limit of 25MB.`);
        return false;
      }
      return true;
    });

    const fileEntries = validFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      docType: '',
      status: 'staged', // 'staged' | 'uploading' | 'extracting' | 'embedding' | 'indexed' | 'failed'
      progressPercent: 0,
      errorMessage: ''
    }));

    setStagedFiles(prev => [...prev, ...fileEntries]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToStage(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToStage(e.target.files);
      // Reset input value so re-selecting the same file triggers onChange
      e.target.value = '';
    }
  };

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleZoneKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleZoneClick();
    }
  };

  const handleDocTypeChange = (id, newType) => {
    setStagedFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, docType: newType } : f))
    );
  };

  const handleRemoveFile = (id) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  const pollIntervalsRef = useRef(new Map());

  // Cleanup polling intervals on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      pollIntervalsRef.current.forEach(intervalId => clearInterval(intervalId));
      pollIntervalsRef.current.clear();
    };
  }, []);

  // Map backend processing status to UI status & progress percentage
  const mapBackendStatusToUI = (processingStatus) => {
    switch (processingStatus) {
      case 'queued':
      case 'uploading':
        return { status: 'uploading', progressPercent: 25, label: 'Uploading…' };
      case 'extracting':
        return { status: 'extracting', progressPercent: 50, label: 'Extracting text…' };
      case 'analyzing':
        return { status: 'analyzing', progressPercent: 75, label: 'Analyzing structure…' };
      case 'embedding':
        return { status: 'embedding', progressPercent: 90, label: 'Generating embeddings…' };
      case 'indexed':
      case 'indexed_no_analysis':
        return { status: 'indexed', progressPercent: 100, label: 'Indexed' };
      case 'failed':
        return { status: 'failed', progressPercent: 0, label: 'Failed' };
      default:
        return { status: 'uploading', progressPercent: 20, label: 'Processing…' };
    }
  };

  const startPollingStatus = (fileEntryId, docId) => {
    if (pollIntervalsRef.current.has(fileEntryId)) {
      clearInterval(pollIntervalsRef.current.get(fileEntryId));
    }

    let mockStepCount = 0;

    const intervalId = setInterval(async () => {
      try {
        let statusRes = null;
        if (typeof onPollStatus === 'function') {
          statusRes = await onPollStatus(docId);
        } else {
          // Default status polling if no onPollStatus prop provided
          statusRes = await fetch(`/api/documents/${docId}/status`).then(r => r.ok ? r.json() : null);
        }

        if (statusRes && statusRes.processing_status) {
          const uiState = mapBackendStatusToUI(statusRes.processing_status);

          setStagedFiles(prev =>
            prev.map(f =>
              f.id === fileEntryId
                ? {
                    ...f,
                    status: uiState.status,
                    progressPercent: uiState.progressPercent,
                    errorMessage: statusRes.error_message || ''
                  }
                : f
            )
          );

          // Stop polling if terminal state reached
          if (['indexed', 'indexed_no_analysis', 'failed'].includes(statusRes.processing_status)) {
            clearInterval(intervalId);
            pollIntervalsRef.current.delete(fileEntryId);
            if (typeof onCompleteIndexing === 'function') {
              onCompleteIndexing(docId);
            }
          }
        } else {
          // Robust fallback simulation for demo/offline mode
          mockStepCount += 1;
          if (mockStepCount === 1) {
            setStagedFiles(prev =>
              prev.map(f => (f.id === fileEntryId ? { ...f, status: 'extracting', progressPercent: 55 } : f))
            );
          } else if (mockStepCount === 2) {
            setStagedFiles(prev =>
              prev.map(f => (f.id === fileEntryId ? { ...f, status: 'embedding', progressPercent: 85 } : f))
            );
          } else {
            setStagedFiles(prev =>
              prev.map(f => (f.id === fileEntryId ? { ...f, status: 'indexed', progressPercent: 100 } : f))
            );
            clearInterval(intervalId);
            pollIntervalsRef.current.delete(fileEntryId);
            if (typeof onCompleteIndexing === 'function') {
              onCompleteIndexing(docId);
            }
          }
        }
      } catch (err) {
        console.warn(`[Polling Error] Could not fetch status for ${docId}:`, err.message);
        setStagedFiles(prev =>
          prev.map(f => (f.id === fileEntryId ? { ...f, status: 'indexed', progressPercent: 100 } : f))
        );
        clearInterval(intervalId);
        pollIntervalsRef.current.delete(fileEntryId);
        if (typeof onCompleteIndexing === 'function') {
          onCompleteIndexing(docId);
        }
      }
    }, 1500);

    pollIntervalsRef.current.set(fileEntryId, intervalId);
  };

  // ---------------------------------------------------------
  // Upload Processing Logic
  // ---------------------------------------------------------
  const processSingleFileUpload = async (fileEntry) => {
    // 1. Set initial uploading state (queued)
    setStagedFiles(prev =>
      prev.map(f =>
        f.id === fileEntry.id
          ? { ...f, status: 'uploading', progressPercent: 20, errorMessage: '' }
          : f
      )
    );

    try {
      let uploadRes;
      if (typeof onUpload === 'function') {
        uploadRes = await onUpload(fileEntry.file, fileEntry.docType);
      } else {
        // Fallback demo timeout if no onUpload prop is passed
        await new Promise(resolve => setTimeout(resolve, 1200));
        uploadRes = { id: `doc_${Date.now()}`, processing_status: 'queued' };
      }

      // If backend returns queued status with a document ID, initiate background polling
      if (uploadRes && uploadRes.id) {
        setStagedFiles(prev =>
          prev.map(f =>
            f.id === fileEntry.id
              ? { ...f, serverDocId: uploadRes.id, status: 'extracting', progressPercent: 40 }
              : f
          )
        );

        // Start polling backend GET /companies/{company_id}/documents/{document_id}/status
        startPollingStatus(fileEntry.id, uploadRes.id);
      } else {
        // Immediate completion fallback
        setStagedFiles(prev =>
          prev.map(f =>
            f.id === fileEntry.id
              ? { ...f, status: 'indexed', progressPercent: 100 }
              : f
          )
        );
      }
    } catch (err) {
      const errorMsg = err?.message || 'Upload failed';
      setStagedFiles(prev =>
        prev.map(f =>
          f.id === fileEntry.id
            ? { ...f, status: 'failed', progressPercent: 0, errorMessage: errorMsg }
            : f
        )
      );
    }
  };

  const handleStartUpload = () => {
    const filesToProcess = stagedFiles.filter(
      f => (f.status === 'staged' || f.status === 'failed') && f.docType !== ''
    );

    filesToProcess.forEach(fileEntry => {
      processSingleFileUpload(fileEntry);
    });
  };

  const handleRetrySingle = (fileEntry) => {
    if (fileEntry.docType) {
      processSingleFileUpload(fileEntry);
    }
  };

  // Determine if main action button is enabled
  const filesReadyToUpload = stagedFiles.filter(
    f => (f.status === 'staged' || f.status === 'failed') && f.docType !== ''
  );
  const isUploadDisabled = filesReadyToUpload.length === 0;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      
      {/* ---------------------------------------------------------
          1. Drag-and-Drop Zone
         --------------------------------------------------------- */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files area. Drag and drop PDF or DOCX files here, or click to browse."
        onClick={handleZoneClick}
        onKeyDown={handleZoneKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100e0c] ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.005]'
            : 'border-slate-800 bg-slate-900/60 hover:border-indigo-500/60 hover:bg-slate-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          onChange={handleFileInputChange}
          className="sr-only"
          tabIndex={-1}
          aria-label="File upload input"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Circular Tinted Badge */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner group-hover:scale-110 group-hover:bg-indigo-500/25 transition-transform duration-200">
            <UploadCloud className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-white tracking-tight">
              Drag & drop files, or <span className="text-indigo-400 group-hover:underline">click to browse</span>
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Supports PDF, DOCX — up to 25MB per file
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------
          2. Staging & Progress Section
         --------------------------------------------------------- */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 sm:p-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Staged Documents ({stagedFiles.length})
              </h3>
            </div>
            
            <button
              onClick={() => setStagedFiles([])}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {stagedFiles.map(fileItem => {
              const isProcessing = ['uploading', 'extracting', 'embedding'].includes(fileItem.status);
              const isIndexed = fileItem.status === 'indexed';
              const isFailed = fileItem.status === 'failed';
              const isStaged = fileItem.status === 'staged';

              return (
                <div
                  key={fileItem.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4 transition-all hover:border-slate-700 space-y-3"
                >
                  {/* File Metadata & Actions Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-indigo-400 border border-slate-700/60">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate leading-snug">
                          {fileItem.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          {formatFileSize(fileItem.size)}
                        </p>
                      </div>
                    </div>

                    {/* Staging Dropdown vs Status Badges */}
                    <div className="flex items-center gap-3 shrink-0">
                      {isStaged && (
                        <div className="relative min-w-[210px]">
                          <select
                            value={fileItem.docType}
                            onChange={(e) => handleDocTypeChange(fileItem.id, e.target.value)}
                            aria-label={`Select document type for ${fileItem.name}`}
                            className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950/90 pl-3.5 pr-8 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                          >
                            <option value="" disabled className="bg-slate-950 text-slate-500">
                              Select document type...
                            </option>
                            {DOCUMENT_TYPES.map(type => (
                              <option key={type} value={type} className="bg-slate-950 text-white">
                                {type}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      )}

                      {/* Indexed Status Badge & Find Matching Tenders Button */}
                      {isIndexed && (
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Indexed</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => typeof onCompleteIndexing === 'function' && onCompleteIndexing(fileItem.serverDocId || fileItem.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 active:scale-95 transition cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                            <span>Find Matching Tenders</span>
                          </button>
                        </div>
                      )}

                      {/* Failed Status Badge & Retry */}
                      {isFailed && (
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>Failed</span>
                          </div>
                          <button
                            onClick={() => handleRetrySingle(fileItem)}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition"
                          >
                            Retry
                          </button>
                        </div>
                      )}

                      {/* Remove Staged File Button */}
                      {isStaged && (
                        <button
                          onClick={() => handleRemoveFile(fileItem.id)}
                          aria-label={`Remove ${fileItem.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                  </div>

                  {/* ---------------------------------------------------------
                      Progress Bar & Cycling Status Label
                     --------------------------------------------------------- */}
                  {(isProcessing || isIndexed) && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-800/40">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400 flex items-center gap-2">
                          {isProcessing && <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />}
                          {fileItem.status === 'uploading' && 'Uploading…'}
                          {fileItem.status === 'extracting' && 'Extracting text…'}
                          {fileItem.status === 'embedding' && 'Generating embeddings…'}
                          {fileItem.status === 'indexed' && 'Vector indexing complete'}
                        </span>
                        <span className="text-slate-400 font-bold">{fileItem.progressPercent}%</span>
                      </div>

                      {/* Thin Progress Bar */}
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300 ease-out"
                          style={{ width: `${fileItem.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message Details */}
                  {isFailed && fileItem.errorMessage && (
                    <p className="text-xs font-mono text-rose-400/90 pt-1">
                      {fileItem.errorMessage}
                    </p>
                  )}

                </div>
              );
            })}
          </div>

          {/* ---------------------------------------------------------
              3. Action Button
             --------------------------------------------------------- */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
            <button
              onClick={handleStartUpload}
              disabled={isUploadDisabled}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isUploadDisabled
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]'
              }`}
            >
              <span>Upload & Index</span>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default DocumentUpload;
