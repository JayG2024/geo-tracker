import React from 'react';

interface GeoTestLogoProps {
  className?: string;
  color?: string;
  showTagline?: boolean;
}

const GeoTestLogo: React.FC<GeoTestLogoProps> = ({ 
  className = '', 
  color = '#3B82F6', // Default blue color
  showTagline = true 
}) => {
  return (
    <svg 
      viewBox="0 0 320 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main Logo Text */}
      <g>
        {/* GEO */}
        <text
          x="10"
          y="45"
          fill={color}
          fontSize="42"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-1"
        >
          GEO
        </text>
        
        {/* Neural Network Icon */}
        <g transform="translate(110, 15)">
          {/* Center node */}
          <circle cx="15" cy="15" r="4" fill={color} opacity="0.8" />
          
          {/* Surrounding nodes */}
          <circle cx="5" cy="5" r="3" fill={color} opacity="0.6" />
          <circle cx="25" cy="5" r="3" fill={color} opacity="0.6" />
          <circle cx="5" cy="25" r="3" fill={color} opacity="0.6" />
          <circle cx="25" cy="25" r="3" fill={color} opacity="0.6" />
          
          {/* Connections */}
          <line x1="15" y1="15" x2="5" y2="5" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="15" y1="15" x2="25" y2="5" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="15" y1="15" x2="5" y2="25" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="15" y1="15" x2="25" y2="25" stroke={color} strokeWidth="1" opacity="0.4" />
        </g>
        
        {/* TEST */}
        <text
          x="150"
          y="45"
          fill={color}
          fontSize="42"
          fontWeight="300"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2"
        >
          TEST
        </text>
      </g>
      
      {/* Tagline */}
      {showTagline && (
        <text
          x="10"
          y="70"
          fill={color}
          fontSize="12"
          fontWeight="400"
          fontFamily="system-ui, -apple-system, sans-serif"
          opacity="0.8"
        >
          Generative Engine Optimization
        </text>
      )}
      
      {/* Decorative underline */}
      <rect
        x="10"
        y="52"
        width="250"
        height="2"
        fill={color}
        opacity="0.3"
      />
    </svg>
  );
};

// Alternative minimalist version
export const GeoTestLogoMinimal: React.FC<GeoTestLogoProps> = ({ 
  className = '', 
  color = '#3B82F6',
  showTagline = true 
}) => {
  return (
    <svg 
      viewBox="0 0 280 80" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main Text with bracket styling */}
      <g>
        {/* Opening bracket */}
        <text
          x="5"
          y="40"
          fill={color}
          fontSize="48"
          fontWeight="200"
          fontFamily="monospace"
          opacity="0.5"
        >
          [
        </text>
        
        {/* GEO TEST */}
        <text
          x="25"
          y="40"
          fill={color}
          fontSize="36"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="3"
        >
          GEO TEST
        </text>
        
        {/* Closing bracket */}
        <text
          x="255"
          y="40"
          fill={color}
          fontSize="48"
          fontWeight="200"
          fontFamily="monospace"
          opacity="0.5"
        >
          ]
        </text>
      </g>
      
      {/* Tagline */}
      {showTagline && (
        <text
          x="25"
          y="60"
          fill={color}
          fontSize="11"
          fontWeight="500"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.5"
          opacity="0.7"
        >
          GENERATIVE ENGINE OPTIMIZATION
        </text>
      )}
    </svg>
  );
};

// Modern tech-inspired version
export const GeoTestLogoTech: React.FC<GeoTestLogoProps> = ({ 
  className = '', 
  color = '#3B82F6',
  showTagline = true 
}) => {
  return (
    <svg 
      viewBox="0 0 300 90" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circuit pattern */}
      <g opacity="0.1">
        <rect x="0" y="35" width="300" height="1" fill={color} />
        <circle cx="50" cy="35" r="3" fill={color} />
        <circle cx="150" cy="35" r="3" fill={color} />
        <circle cx="250" cy="35" r="3" fill={color} />
      </g>
      
      {/* Main Logo */}
      <g>
        {/* GEO with tech styling */}
        <text
          x="20"
          y="45"
          fill={color}
          fontSize="40"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-2"
        >
          GEO
        </text>
        
        {/* Separator dot */}
        <circle cx="115" cy="40" r="3" fill={color} opacity="0.6" />
        
        {/* TEST with lighter weight */}
        <text
          x="130"
          y="45"
          fill={color}
          fontSize="40"
          fontWeight="200"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="4"
        >
          TEST
        </text>
        
        {/* AI indicator */}
        <g transform="translate(260, 25)">
          <rect x="0" y="0" width="20" height="20" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
          <text x="10" y="14" fill={color} fontSize="10" fontWeight="600" textAnchor="middle">AI</text>
        </g>
      </g>
      
      {/* Tagline */}
      {showTagline && (
        <g>
          <text
            x="20"
            y="65"
            fill={color}
            fontSize="10"
            fontWeight="600"
            fontFamily="monospace"
            letterSpacing="1"
            opacity="0.6"
          >
            GENERATIVE ENGINE OPTIMIZATION
          </text>
          
          {/* Blinking cursor effect */}
          <rect x="235" y="55" width="2" height="12" fill={color} opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;0;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      )}
    </svg>
  );
};

export default GeoTestLogo;