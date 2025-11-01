// ============================================
// FILE: src/Pages/DashboardPage.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Loader2, CheckCircle2, AlertTriangle, 
  ServerCrash, Clock, Eye, Trash2, RefreshCw,
  Sparkles, TrendingUp, Activity, Calendar,
  ExternalLink, X, AlertCircle
} from 'lucide-react';

// Results Modal Component
const ResultsModal = ({ scan, onClose }) => {
  if (!scan) return null;

  const isFailed = scan.status === 'failed';
  const issues = scan.results?.issues || [];

  // Group issues by type
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const notices = issues.filter(i => i.type === 'notice');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                {isFailed ? (
                  <>
                    <ServerCrash className="h-8 w-8" />
                    Scan Failed
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-8 w-8" />
                    Scan Results
                  </>
                )}
              </h2>
              <a 
                href={scan.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-white transition-colors flex items-center gap-2 text-lg break-all"
              >
                {scan.url}
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
              </a>
              <p className="text-blue-100 mt-2">
                Scanned: {new Date(scan.scanned_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isFailed ? (
            // Failed Scan Display
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">Scan Error</h3>
                  <p className="text-red-700">
                    {scan.results?.error || 'An unknown error occurred during the scan.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Successful Scan Display
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 font-medium">Errors</p>
                      <p className="text-3xl font-bold text-red-900">{errors.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 font-medium">Warnings</p>
                      <p className="text-3xl font-bold text-yellow-900">{warnings.length}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium">Total Issues</p>
                      <p className="text-3xl font-bold text-blue-900">{issues.length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Issues List */}
              {issues.length === 0 ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    No Accessibility Issues Found!
                  </h3>
                  <p className="text-green-700">
                    This page appears to meet accessibility standards.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Issues Found:</h3>
                  
                  {/* Errors Section */}
                  {errors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-red-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Errors ({errors.length})
                      </h4>
                      {errors.map((issue, idx) => (
                        <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                          <p className="font-medium text-red-900 mb-1">{issue.message}</p>
                          <code className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                            {issue.selector}
                          </code>
                          {issue.context && (
                            <pre className="mt-2 text-xs text-gray-700 bg-white p-2 rounded overflow-x-auto">
                              {issue.context}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warnings Section */}
                  {warnings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-yellow-900 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Warnings ({warnings.length})
                      </h4>
                      {warnings.map((issue, idx) => (
                        <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                          <p className="font-medium text-yellow-900 mb-1">{issue.message}</p>
                          <code className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                            {issue.selector}
                          </code>
                          {issue.context && (
                            <pre className="mt-2 text-xs text-gray-700 bg-white p-2 rounded overflow-x-auto">
                              {issue.context}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-lg"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Main Dashboard Component
const DashboardPage = () => {
  // State Management
  const [url, setUrl] = useState('');
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);

  const navigate = useNavigate();

  // Fetch scan history on mount
  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/scans', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setScans(response.data.scans || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scans:', err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load scan history');
        setLoading(false);
      }
    }
  };

  // Handle new scan submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setScanning(true);
    setError('');

    // Create optimistic "pending" scan
    const pendingScan = {
      scan_id: 'pending',
      url: url,
      status: 'pending',
      scanned_at: new Date().toISOString(),
      issueCount: 0
    };

    // Add pending scan to top of list
    setScans(prev => [pendingScan, ...prev]);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/scans',
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newScan = response.data.scan;

      // Replace pending scan with actual result
      setScans(prev => prev.map(scan => 
        scan.scan_id === 'pending' ? newScan : scan
      ));

      // Clear input
      setUrl('');

      // Auto-open results if successful
      if (newScan.status === 'completed') {
        setSelectedScan(newScan);
      }

    } catch (err) {
      console.error('Error running scan:', err);
      
      // Remove pending scan
      setScans(prev => prev.filter(scan => scan.scan_id !== 'pending'));
      
      setError(err.response?.data?.error || 'Failed to run scan. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  // Handle delete scan
  const handleDelete = async (scanId) => {
    if (!confirm('Are you sure you want to delete this scan?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/scans/${scanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from list
      setScans(prev => prev.filter(scan => scan.scan_id !== scanId));
    } catch (err) {
      console.error('Error deleting scan:', err);
      setError('Failed to delete scan');
    }
  };

  // Get status icon
  const getStatusIcon = (scan) => {
    if (scan.status === 'pending') {
      return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
    if (scan.status === 'failed') {
      return <ServerCrash className="h-5 w-5 text-red-600" />;
    }
    if (scan.issueCount > 0) {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-blue-600 animate-pulse" />
            Accessibility Scanner
          </h1>
          <p className="text-xl text-gray-600">
            Check any website for accessibility issues
          </p>
        </div>

        {/* Scan Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 mb-8 animate-fade-in animation-delay-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-xl font-bold text-gray-900 mb-3">
                Enter Website URL
              </label>
              <div className="flex gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    disabled={scanning}
                    className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={scanning || !url.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2 whitespace-nowrap"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Run Scan
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Scan History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 animate-fade-in animation-delay-400">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              Scan History
            </h2>
            <button
              onClick={fetchScans}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-all hover:-rotate-45 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2"
            >
              <RefreshCw className="h-5 w-5 transition-transform" />
              Refresh
            </button>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No scans yet</p>
              <p className="text-gray-400">Enter a URL above to run your first accessibility scan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan) => (
                <div
                  key={scan.scan_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group border-2 border-transparent hover:border-blue-200"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {getStatusIcon(scan)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{scan.url}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(scan.scanned_at).toLocaleDateString()}
                        </span>
                        {scan.status === 'completed' && (
                          <span className={`font-medium ${
                            scan.issueCount === 0 ? 'text-green-600' : 
                            scan.issueCount > 10 ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {scan.issueCount} {scan.issueCount === 1 ? 'issue' : 'issues'}
                          </span>
                        )}
                        {scan.status === 'failed' && (
                          <span className="text-red-600 font-medium">Failed</span>
                        )}
                        {scan.status === 'pending' && (
                          <span className="text-blue-600 font-medium">Scanning...</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {scan.status !== 'pending' && (
                      <>
                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(scan.scan_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Delete scan"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {selectedScan && (
        <ResultsModal 
          scan={selectedScan} 
          onClose={() => setSelectedScan(null)} 
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;