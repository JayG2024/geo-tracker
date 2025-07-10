import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';
import { FileDown } from 'lucide-react';

interface PDFGeneratorV2Props {
  analysis: any;
  url: string;
}

export function PDFGeneratorV2({ analysis, url }: PDFGeneratorV2Props) {
  const generatePDF = async () => {
    // Create a hidden div with the report content
    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.width = '800px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(reportContainer);

    // Generate HTML content with inline styles
    reportContainer.innerHTML = `
      <div style="padding: 40px; background: white;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 36px; color: #1e40af; margin: 0;">GeoTest.ai</h1>
          <p style="font-size: 18px; color: #64748b; margin-top: 10px;">AI Search Visibility Report</p>
        </div>

        <!-- Score Cards -->
        <div style="display: flex; gap: 20px; margin-bottom: 40px;">
          <div style="flex: 1; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 16px; color: white; text-align: center;">
            <h3 style="margin: 0; font-size: 16px; opacity: 0.9;">SEO Score</h3>
            <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">${analysis.seoScore || 0}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Traditional Search</p>
          </div>
          <div style="flex: 1; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 16px; color: white; text-align: center;">
            <h3 style="margin: 0; font-size: 16px; opacity: 0.9;">GEO Score</h3>
            <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">${analysis.geoScore || 0}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">AI Search Visibility</p>
          </div>
        </div>

        <!-- URL Info -->
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 40px;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Analyzed URL</p>
          <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 18px; font-weight: 600; word-break: break-all;">${url}</p>
          <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Report generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- AI Visibility Results -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 20px;">AI Platform Visibility</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
            ${['ChatGPT', 'Claude', 'Perplexity', 'Gemini'].map(platform => {
              const isVisible = analysis.aiVisibility?.[platform.toLowerCase()] || false;
              return `
                <div style="background: ${isVisible ? '#f0fdf4' : '#fef2f2'}; border: 1px solid ${isVisible ? '#86efac' : '#fecaca'}; padding: 16px; border-radius: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">${isVisible ? '✅' : '❌'}</span>
                    <span style="font-weight: 600; color: #1e293b;">${platform}</span>
                  </div>
                  <p style="margin: 8px 0 0 28px; color: #64748b; font-size: 14px;">
                    ${isVisible ? 'Your site is visible' : 'Not found in this AI'}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Key Findings -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 20px;">Key Findings</h2>
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px;">
            ${analysis.recommendations?.slice(0, 5).map((rec: string, i: number) => `
              <div style="display: flex; gap: 12px; margin-bottom: ${i < 4 ? '16px' : '0'};">
                <div style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold;">
                  ${i + 1}
                </div>
                <p style="margin: 0; color: #1e293b; line-height: 1.6;">${rec}</p>
              </div>
            `).join('') || '<p style="color: #64748b;">No specific recommendations at this time.</p>'}
          </div>
        </div>

        <!-- Performance Metrics -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 20px;">Performance Metrics</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Page Speed</p>
              <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">
                ${analysis.performance?.speed || 'N/A'}
              </p>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Mobile Ready</p>
              <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">
                ${analysis.performance?.mobile ? 'Yes' : 'No'}
              </p>
            </div>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">SSL Secure</p>
              <p style="margin: 8px 0 0 0; color: #1e293b; font-size: 24px; font-weight: bold;">
                ${url.startsWith('https') ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Generated by GeoTest.ai - The AI Search Visibility Tool
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">
            © ${new Date().getFullYear()} GeoTest.ai. Visit us at www.geotest.ai
          </p>
        </div>
      </div>
    `;

    // Convert HTML to canvas
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800
    });

    // Clean up
    document.body.removeChild(reportContainer);

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF, handling pagination
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const fileName = `geotest-report-${new URL(url).hostname}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  return (
    <Button onClick={generatePDF} className="gap-2">
      <FileDown className="h-4 w-4" />
      Download PDF Report
    </Button>
  );
}