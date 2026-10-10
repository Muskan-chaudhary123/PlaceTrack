import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { resourcesApi } from '../../api/resources';

export const ResourcePreviewModal = ({ resource, onClose, onDownload }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const file = resource?.file;
  const isPdf = file?.fileName?.toLowerCase().endsWith('.pdf') || file?.contentType === 'application/pdf';

  useEffect(() => {
    let activeUrl = null;
    const fetchBlob = async () => {
      if (!resource || !file) return;
      if (!isPdf) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const url = await resourcesApi.getFileBlobUrl(resource.id);
        activeUrl = url;
        setBlobUrl(url);
      } catch (err) {
        // Fallback to direct URL if blob fetch fails
        try {
          const direct = resourcesApi.getDirectFileUrl(resource.id, true);
          setBlobUrl(direct);
        } catch (e) {
          setError('Failed to load document preview.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlob();

    return () => {
      if (activeUrl && activeUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(activeUrl);
      }
    };
  }, [resource, file, isPdf]);

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    } else {
      const direct = resourcesApi.getDirectFileUrl(resource.id, true);
      window.open(direct, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs" />

      <div className="relative z-10 flex flex-col w-full max-w-4xl h-[90vh] rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-3.5">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {resource.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {file?.fileName} {file?.fileSize ? `(${Math.round(file.fileSize / 1024)} KB)` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPdf && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenNewTab}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in Tab</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => onDownload(resource)}
              className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Preview Area */}
        <div className="flex-1 bg-slate-100/70 p-2 sm:p-4 overflow-hidden flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs font-semibold text-slate-500">Loading document preview...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-200 max-w-md mx-auto space-y-3">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">Preview Unavailable</h4>
              <p className="text-xs text-slate-500">{error}</p>
              <Button size="sm" onClick={() => onDownload(resource)}>
                Download File Instead
              </Button>
            </div>
          ) : isPdf && blobUrl ? (
            <iframe
              src={blobUrl}
              title={file?.fileName || 'PDF Preview'}
              className="w-full h-full rounded-lg bg-white border border-slate-200 shadow-inner"
            />
          ) : (
            <div className="text-center p-8 bg-white rounded-xl border border-slate-200 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {file?.fileName || 'Document File'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  In-browser preview is natively supported for PDF documents. Download this file to view it on your device.
                </p>
              </div>
              <Button onClick={() => onDownload(resource)} className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Download {file?.fileName}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePreviewModal;

