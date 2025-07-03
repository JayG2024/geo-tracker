import React, { useState } from 'react';
import { Search, Globe, MapPin, Brain, FileText, Loader, Zap, Target, TrendingUp, Award, Lightbulb, Shield, BarChart3 } from 'lucide-react';

interface URLAnalysisFormProps {
  onAnalyze: (url: string, analysisTypes: string[]) => void;
  isLoading: boolean;
  useMultiAI: boolean;
}

const URLAnalysisForm: React.FC<URLAnalysisFormProps> = ({ onAnalyze, isLoading, useMultiAI }) => {
  const [url, setUrl] = useState('');
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>(['geo', 'ai', 'technical', 'content']);
  const [clientName, setClientName] = useState('');

  const analysisTypes = [
    { 
      id: 'geo', 
      name: '✨ Citation-Worthiness Analysis', 
      icon: Lightbulb, 
      description: 'AI citation potential assessment and content authority evaluation for generative search engines', 
      aiProvider: useMultiAI ? 'Enhanced GPT-4 + Gemini Pro Authority Analysis' : 'Advanced GEO Citation Analysis',
      features: ['AI citation probability scoring', 'Content authority assessment', 'Citation-worthy content gaps', 'Authority building roadmap', 'Generative search optimization']
    },
    { 
      id: 'ai', 
      name: '🧑‍🔬 E-E-A-T Signal Strength', 
      icon: Shield, 
      description: 'Expertise, Experience, Authoritativeness, and Trustworthiness signals analysis for AI systems', 
      aiProvider: useMultiAI ? 'Claude 3.5 + GPT-4 E-E-A-T Assessment' : 'Comprehensive E-E-A-T Evaluation',
      features: ['Expert profile analysis', 'Authority signal detection', 'Trust indicator assessment', 'Experience validation', 'AI system trust scoring']
    },
    { 
      id: 'technical', 
      name: '📜 Structured Data & Schema', 
      icon: BarChart3, 
      description: 'Advanced structured data implementation for AI system comprehension and content interpretation', 
      aiProvider: useMultiAI ? 'Gemini Pro Technical + Schema Analysis' : 'Advanced Schema Optimization',
      features: ['AI-readable markup audit', 'Schema implementation gaps', 'Machine comprehension scoring', 'Structured data optimization', 'AI system compatibility']
    },
    { 
      id: 'content', 
      name: '📚 Content Depth & Authority', 
      icon: FileText, 
      description: 'Comprehensive content analysis for topical authority and AI system citation potential', 
      aiProvider: useMultiAI ? 'GPT-4 Content Authority + Depth Analysis' : 'Content Authority Assessment',
      features: ['Topic coverage depth analysis', 'Authority content scoring', 'Content gap identification', 'Expert insight integration', 'Citation-worthy resource development']
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && selectedAnalyses.length > 0) {
      onAnalyze(url.trim(), selectedAnalyses);
    }
  };

  const toggleAnalysis = (analysisId: string) => {
    setSelectedAnalyses(prev => 
      prev.includes(analysisId) 
        ? prev.filter(id => id !== analysisId)
        : [...prev, analysisId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Header for GEO Focus */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl mb-6 shadow-xl">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {useMultiAI ? '✨ Premium Multi-AI GEO Analysis ✨' : '🚀 Advanced GEO Analysis Platform'}
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          {useMultiAI ? (
            <>Comprehensive <strong>Generative Engine Optimization (GEO)</strong> analysis powered by <strong>GPT-4, Enhanced Gemini Pro & Claude 3.5</strong> to establish your authority as the definitive AI-cited expert in your field</>
          ) : (
            'Professional GEO analysis platform to transform your website from a "brochure" into a "knowledge base" that AI systems trust and cite'
          )}
        </p>
        
        {/* GEO Value Proposition */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Why GEO Analysis Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-bold text-gray-900 mb-2">AI Citation Potential</h3>
              <p className="text-gray-700 text-sm">Your customers now ask AI for answers. Become the source AI trusts and cites.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-bold text-gray-900 mb-2">Authority Leadership</h3>
              <p className="text-gray-700 text-sm">Establish unbreakable competitive advantages through content authority.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Future-Proof ROI</h3>
              <p className="text-gray-700 text-sm">Capture high-intent customers at the very beginning of their journey.</p>
            </div>
          </div>
        </div>
        
        {useMultiAI && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="text-3xl mb-3">🤖</div>
              <div className="text-sm font-bold text-green-800">OpenAI GPT-4</div>
              <div className="text-xs text-green-600">Content Authority & Citation Analysis</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-sm font-bold text-blue-800">Enhanced Gemini Pro</div>
              <div className="text-xs text-blue-600">Technical GEO + Structured Data</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
              <div className="text-3xl mb-3">🎯</div>
              <div className="text-sm font-bold text-purple-800">Claude 3.5 Sonnet</div>
              <div className="text-xs text-purple-600">E-E-A-T + Authority Assessment</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Client Information */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            Project Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-3">
                Client/Project Name (Optional)
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter client or project name"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-3">
                Website URL *
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
        </div>

        {/* GEO Analysis Selection */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-3" />
            {useMultiAI ? '✨ Multi-AI GEO Analysis Selection' : '🚀 Comprehensive GEO Analysis Selection'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {analysisTypes.map((analysis) => {
              const Icon = analysis.icon;
              const isSelected = selectedAnalyses.includes(analysis.id);
              
              return (
                <div
                  key={analysis.id}
                  className={`relative p-8 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                  }`}
                  onClick={() => toggleAnalysis(analysis.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-xl ${isSelected ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-gray-100 to-gray-200'} shadow-lg`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-bold text-lg ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {analysis.name}
                        </h4>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mb-4 leading-relaxed ${isSelected ? 'text-blue-800' : 'text-gray-600'}`}>
                        {analysis.description}
                      </p>
                      {useMultiAI && (
                        <p className={`text-xs font-semibold mb-4 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                          🧠 Powered by: {analysis.aiProvider}
                        </p>
                      )}
                      <div className="space-y-2">
                        {analysis.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className={`text-xs flex items-center ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                            <span className={`w-2 h-2 rounded-full mr-3 ${isSelected ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                            {feature}
                          </div>
                        ))}
                        {analysis.features.length > 3 && (
                          <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                            +{analysis.features.length - 3} more features...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analysis Depth Options */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-6 h-6 text-orange-600 mr-3" />
            GEO Analysis Depth & Authority Focus
          </h3>
          <div className="space-y-6">
            <label className="flex items-start p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all">
              <input
                type="radio"
                name="depth"
                value="comprehensive"
                defaultChecked={useMultiAI}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
              />
              <div className="ml-6">
                <span className="font-bold text-gray-900 text-lg block mb-2">
                  {useMultiAI ? '✨ Deep Multi-AI GEO Authority Analysis' : '🚀 Comprehensive GEO Authority Analysis'}
                </span>
                <div className="text-gray-700 mb-4 leading-relaxed">
                  {useMultiAI ? (
                    'Complete authority analysis with 3-AI consensus scoring, E-E-A-T enhancement, citation optimization, and detailed authority building strategy (8-12 minutes)'
                  ) : (
                    'Full GEO analysis with citation potential assessment, E-E-A-T evaluation, content authority scoring, and comprehensive authority roadmap (6-10 minutes)'
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">Citation Analysis</span>
                  <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">E-E-A-T Assessment</span>
                  <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">Authority Strategy</span>
                  <span className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-xs px-3 py-1 rounded-full font-medium">AI Optimization</span>
                </div>
              </div>
            </label>
            
            <label className="flex items-start p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all">
              <input
                type="radio"
                name="depth"
                value="quick"
                defaultChecked={!useMultiAI}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
              />
              <div className="ml-6">
                <span className="font-bold text-gray-900 text-lg block mb-2">
                  {useMultiAI ? '⚡ Quick Multi-AI GEO Scan' : '🎯 Essential GEO Assessment'}
                </span>
                <div className="text-gray-700 mb-4 leading-relaxed">
                  {useMultiAI ? (
                    'Rapid 3-AI assessment focusing on critical GEO gaps, immediate citation opportunities, and priority authority building actions (4-6 minutes)'
                  ) : (
                    'Essential GEO metrics with citation potential scoring, basic E-E-A-T evaluation, and immediate optimization opportunities (3-5 minutes)'
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">Quick Assessment</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">Priority Actions</span>
                  <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">Critical Issues</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !url.trim() || selectedAnalyses.length === 0}
            className={`${
              useMultiAI 
                ? 'bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            } disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-6 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-4 text-lg`}
          >
            {isLoading ? (
              <>
                <Loader className="w-8 h-8 animate-spin" />
                <span>{useMultiAI ? '✨ Multi-AI GEO Analysis in Progress...' : '🚀 Comprehensive GEO Analysis in Progress...'}</span>
              </>
            ) : (
              <>
                {useMultiAI ? <Brain className="w-8 h-8" /> : <Lightbulb className="w-8 h-8" />}
                <span>{useMultiAI ? '✨ Start Multi-AI GEO Analysis' : '🚀 Start GEO Authority Analysis'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* What You'll Get Section - Updated for GEO */}
      <div className={`mt-16 ${
        useMultiAI 
          ? 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-green-200' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
      } rounded-2xl p-10 border-2`}>
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {useMultiAI ? '✨ Premium Multi-AI GEO Analysis Features:' : '🚀 Comprehensive GEO Analysis Features:'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useMultiAI ? (
            <>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">3-AI Citation Consensus</h4>
                  <p className="text-sm text-gray-600">GPT-4, Gemini Pro & Claude 3.5 consensus on AI citation potential and authority building</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Advanced E-E-A-T Analysis</h4>
                  <p className="text-sm text-gray-600">Deep expertise, experience, authoritativeness, and trust signal assessment</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Authority Building Roadmap</h4>
                  <p className="text-sm text-gray-600">Phase-by-phase strategy to become the AI-cited authority in your field</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Citation-Worthy Content Strategy</h4>
                  <p className="text-sm text-gray-600">Specific recommendations for creating content that AI systems will trust and cite</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Professional GEO Report</h4>
                  <p className="text-sm text-gray-600">25+ page strategic analysis with actionable authority building insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Client-Ready Deliverables</h4>
                  <p className="text-sm text-gray-600">Professional branded reports with analytics tracking for client presentation</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Citation Potential Analysis</h4>
                  <p className="text-sm text-gray-600">Comprehensive assessment of AI citation opportunities and content gaps</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Authority ROI Projections</h4>
                  <p className="text-sm text-gray-600">3-year financial forecasts with authority building investment analysis</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Authority Implementation Plan</h4>
                  <p className="text-sm text-gray-600">Step-by-step roadmap to become the AI-trusted expert in your niche</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-orange-500 to-yellow-600 p-3 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">E-E-A-T Enhancement Strategy</h4>
                  <p className="text-sm text-gray-600">Detailed analysis of expertise signals and trust building opportunities</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Professional GEO Reports</h4>
                  <p className="text-sm text-gray-600">Comprehensive PDF and shareable client reports with authority insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">AI-Driven Insights</h4>
                  <p className="text-sm text-gray-600">Advanced analysis with smart recommendations for AI citation optimization</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLAnalysisForm;