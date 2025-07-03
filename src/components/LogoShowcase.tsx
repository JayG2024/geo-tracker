import React from 'react';
import GeoTestLogo, { GeoTestLogoMinimal, GeoTestLogoTech } from './GeoTestLogo';

const LogoShowcase: React.FC = () => {
  const colors = {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    indigo: '#6366F1',
    teal: '#14B8A6',
    gray: '#6B7280',
    black: '#000000'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">GEO TEST Logo Variations</h1>
        
        {/* Logo 1: Neural Network Style */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Neural Network Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-2 capitalize">{name}</p>
                <GeoTestLogo color={color} className="w-full max-w-xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Logo 2: Minimalist Bracket Style */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Minimalist Bracket Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-2 capitalize">{name}</p>
                <GeoTestLogoMinimal color={color} className="w-full max-w-xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Logo 3: Tech Circuit Style */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Tech Circuit Style</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-2 capitalize">{name}</p>
                <GeoTestLogoTech color={color} className="w-full max-w-xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Dark Background Examples */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">On Dark Background</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <GeoTestLogo color="#FFFFFF" className="w-full max-w-xs" />
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <GeoTestLogoMinimal color="#FFFFFF" className="w-full max-w-xs" />
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <GeoTestLogoTech color="#FFFFFF" className="w-full max-w-xs" />
            </div>
          </div>
        </div>

        {/* Without Tagline */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Without Tagline (Compact)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <GeoTestLogo showTagline={false} className="w-full max-w-xs" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <GeoTestLogoMinimal showTagline={false} className="w-full max-w-xs" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <GeoTestLogoTech showTagline={false} className="w-full max-w-xs" />
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Examples</h2>
          
          {/* Header Example */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <p className="text-sm text-gray-600 mb-4">Header Usage</p>
            <div className="flex items-center justify-between border-b pb-4">
              <GeoTestLogoTech color="#3B82F6" className="h-12" showTagline={false} />
              <nav className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Analysis</a>
                <a href="#" className="text-gray-600 hover:text-blue-600">Reports</a>
              </nav>
            </div>
          </div>

          {/* Icon Size */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-4">Different Sizes</p>
            <div className="flex items-center space-x-8">
              <GeoTestLogoMinimal color="#6366F1" className="h-8" showTagline={false} />
              <GeoTestLogoMinimal color="#6366F1" className="h-12" showTagline={false} />
              <GeoTestLogoMinimal color="#6366F1" className="h-16" showTagline={false} />
              <GeoTestLogoMinimal color="#6366F1" className="h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;