import React, { useState } from 'react';
import { Share2, Settings, Palette, Lock, Calendar, Download, X, Check } from 'lucide-react';
import { reportService } from '../services/reportService';
import { CombinedAnalysis } from '../types/analysis';
import { ShareableReport } from '../types/reports';

interface CreateShareableReportProps {
  analysis: CombinedAnalysis;
  onReportCreated: (report: ShareableReport) => void;
  onCancel: () => void;
}

const CreateShareableReport: React.FC<CreateShareableReportProps> = ({
  analysis,
  onReportCreated,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: `Analysis for ${analysis.url}`,
    expiresInDays: 30,
    password: '',
    usePassword: false,
    customBranding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      companyName: 'GEO Tracking Analysis',
      logo: ''
    },
    shareSettings: {
      allowDownload: true,
      allowSharing: true,
      trackAnalytics: true,
      requireContact: false
    }
  });
  const [creating, setCreating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [createdReport, setCreatedReport] = useState<ShareableReport | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customBranding: {
        ...prev.customBranding,
        [field]: value
      }
    }));
  };

  const handleShareSettingsChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      shareSettings: {
        ...prev.shareSettings,
        [field]: value
      }
    }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreateReport = async () => {
    try {
      setCreating(true);
      
      const report = await reportService.createShareableReport(analysis, {
        clientName: formData.clientName,
        expiresInDays: formData.expiresInDays === 0 ? undefined : formData.expiresInDays,
        password: formData.usePassword ? formData.password : undefined,
        customBranding: formData.customBranding,
        shareSettings: formData.shareSettings
      });

      const shareableUrl = reportService.generateShareableURL(report.id);
      setPreviewUrl(shareableUrl);
      setCreatedReport(report);
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDone = () => {
    if (createdReport) {
      onReportCreated(createdReport);
    } else {
      onCancel();
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="w-6 h-6 text-blue-600 mr-3" />
          Basic Report Settings
        </h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Client/Report Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter client or report name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Report Expiration
            </label>
            <select
              value={formData.expiresInDays}
              onChange={(e) => handleInputChange('expiresInDays', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={0}>Never expires</option>
            </select>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.usePassword}
                    onChange={(e) => handleInputChange('usePassword', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                  />
                  <span className="font-semibold text-gray-800">Password protect this report</span>
                </label>
                <p className="text-sm text-gray-600 mt-1">Recommended for sensitive client data</p>
                
                {formData.usePassword && (
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter secure password"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
          <Share2 className="w-5 h-5 text-green-600 mr-2" />
          Share Permissions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'allowDownload', label: 'Allow PDF download', description: 'Clients can download the full report' },
            { key: 'allowSharing', label: 'Allow social sharing', description: 'Enable sharing via social media' },
            { key: 'trackAnalytics', label: 'Track analytics', description: 'Monitor views and engagement' },
            { key: 'requireContact', label: 'Require contact info', description: 'Collect visitor information' }
          ].map((setting) => (
            <label key={setting.key} className="flex items-start p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.shareSettings[setting.key as keyof typeof formData.shareSettings]}
                onChange={(e) => handleShareSettingsChange(setting.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 mr-3"
              />
              <div>
                <span className="font-medium text-gray-900 block">{setting.label}</span>
                <span className="text-sm text-gray-600">{setting.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Palette className="w-6 h-6 text-purple-600 mr-3" />
          Custom Branding & Design
        </h3>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Company Name
            </label>
            <input
              type="text"
              value={formData.customBranding.companyName}
              onChange={(e) => handleBrandingChange('companyName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Your company name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Primary Color
              </label>
              <div className="flex space-x-3">
                <input
                  type="color"
                  value={formData.customBranding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.customBranding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Secondary Color
              </label>
              <div className="flex space-x-3">
                <input
                  type="color"
                  value={formData.customBranding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.customBranding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Color Preview */}
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <h4 className="font-bold text-gray-900 mb-4">Brand Preview</h4>
            <div 
              className="rounded-xl p-8 text-white shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${formData.customBranding.primaryColor} 0%, ${formData.customBranding.secondaryColor} 100%)` 
              }}
            >
              <h3 className="text-2xl font-bold mb-3">{formData.customBranding.companyName}</h3>
              <p className="opacity-90 text-lg">Professional GEO Analysis Report</p>
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-block">
                <span className="text-sm font-medium">Sample Report Element</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Check className="w-6 h-6 text-green-600 mr-3" />
          Review & Create Report
        </h3>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-4">Report Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Client Name:</span>
                <p className="text-gray-900 mt-1">{formData.clientName}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Website:</span>
                <p className="text-gray-900 mt-1 break-all">{analysis.url}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Company:</span>
                <p className="text-gray-900 mt-1">{formData.customBranding.companyName}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">Expires:</span>
                <p className="text-gray-900 mt-1">
                  {formData.expiresInDays === 0 ? 'Never' : `${formData.expiresInDays} days`}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Access:</span>
                <p className="text-gray-900 mt-1">
                  {formData.usePassword ? 'Password Protected' : 'Public Access'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Brand Colors:</span>
                <div className="flex space-x-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded-lg border border-gray-300 shadow-sm"
                    style={{ backgroundColor: formData.customBranding.primaryColor }}
                  ></div>
                  <div 
                    className="w-6 h-6 rounded-lg border border-gray-300 shadow-sm"
                    style={{ backgroundColor: formData.customBranding.secondaryColor }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="font-semibold text-gray-700 block mb-2">Enabled Features:</span>
            <div className="flex flex-wrap gap-2">
              {formData.shareSettings.allowDownload && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Download Enabled</span>
              )}
              {formData.shareSettings.allowSharing && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Sharing Enabled</span>
              )}
              {formData.shareSettings.trackAnalytics && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">Analytics Enabled</span>
              )}
              {formData.shareSettings.requireContact && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">Contact Required</span>
              )}
            </div>
          </div>
        </div>

        {previewUrl && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Check className="w-6 h-6 text-green-600 mr-3" />
              <h4 className="font-bold text-green-900 text-lg">Report Created Successfully!</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-2">Shareable URL:</label>
                <div className="flex">
                  <input
                    type="text"
                    value={previewUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-green-300 rounded-l-lg bg-white text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(previewUrl);
                      alert('URL copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Share2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create Shareable Report</h2>
                <p className="text-blue-100">Professional client delivery platform</p>
              </div>
            </div>
            {!previewUrl && (
              <button
                onClick={onCancel}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Enhanced Step Indicator */}
          <div className="mt-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    step >= stepNumber
                      ? 'bg-white text-blue-600 shadow-lg scale-110'
                      : 'bg-white/20 text-white/70'
                  }`}>
                    {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                      step > stepNumber ? 'bg-white shadow-sm' : 'bg-white/20'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center mt-3 text-sm text-blue-100">
              <div className="grid grid-cols-3 gap-8 text-center">
                <span className={step >= 1 ? 'font-medium text-white' : ''}>Settings</span>
                <span className={step >= 2 ? 'font-medium text-white' : ''}>Branding</span>
                <span className={step >= 3 ? 'font-medium text-white' : ''}>Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              {step > 1 && !previewUrl && (
                <button
                  onClick={handlePrevStep}
                  className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ← Back
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {previewUrl ? (
                <button
                  onClick={handleDone}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
                >
                  Done
                </button>
              ) : step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleCreateReport}
                  disabled={creating}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg flex items-center space-x-3"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Report...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Create Report</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShareableReport;