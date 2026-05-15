import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Download, FileText, CheckCircle } from 'lucide-react';

const funds = [
  { name: 'HDFC Flexicap Fund - Growth', invested: 100000, current: 145000 },
  { name: 'HDFC Mid Cap Opportunities Fund - Growth', invested: 50000, current: 72000 },
  { name: 'ICICI Prudential Bluechip Fund - Growth', invested: 75000, current: 98500 },
  { name: 'ICICI Prudential Liquid Fund - Growth', invested: 200000, current: 215000 },
  { name: 'SBI Small Cap Fund - Regular Plan - Growth', invested: 60000, current: 78000 },
  { name: 'SBI Equity Hybrid Fund - Growth', invested: 80000, current: 92000 },
  { name: 'Axis Bluechip Fund - Growth', invested: 50000, current: 58500 },
  { name: 'Axis Long Term Equity Fund - ELSS', invested: 50000, current: 68000 },
  { name: 'Nippon India Growth Fund - Growth', invested: 40000, current: 52000 },
  { name: 'Nippon India Liquid Fund - Growth', invested: 100000, current: 106000 },
  { name: 'UTI Flexi Cap Fund - Growth', invested: 70000, current: 89000 },
  { name: 'UTI Nifty Index Fund - Growth', invested: 30000, current: 38000 },
  { name: 'Kotak Emerging Equity Fund - Growth', invested: 45000, current: 58000 },
  { name: 'Kotak Liquid Fund - Growth', invested: 150000, current: 158000 },
  { name: 'Mirae Asset Large Cap Fund - Growth', invested: 55000, current: 72000 },
  { name: 'Mirae Asset Hybrid Equity Fund - Growth', invested: 60000, current: 68000 },
  { name: 'Tata Hybrid Equity Fund - Growth', invested: 70000, current: 82000 },
  { name: 'Tata Liquid Fund - Growth', invested: 80000, current: 84200 },
  { name: 'Aditya Birla Frontline Equity Fund - Growth', invested: 50000, current: 64000 },
  { name: 'Aditya Birla Tax Relief 96 - ELSS', invested: 50000, current: 72000 },
  { name: 'DSP Tax Saver Fund - ELSS', invested: 50000, current: 68000 },
  { name: 'DSP Liquid Fund - Growth', invested: 120000, current: 126000 },
  { name: 'Sundaram Large Cap Fund - Growth', invested: 40000, current: 49000 },
  { name: 'Sundaram Debt Bond Fund - Growth', invested: 60000, current: 64800 },
  { name: 'L&T India Value Fund - Growth', invested: 55000, current: 69000 },
  { name: 'L&T Liquid Fund - Growth', invested: 90000, current: 94500 },
  { name: 'Quant Active Fund - Growth', invested: 50000, current: 68000 },
  { name: 'Quant Liquid Fund - Growth', invested: 100000, current: 104500 },
  { name: 'Bandhan Sterling Value Fund - Growth', invested: 45000, current: 56000 },
  { name: 'Bandhan Liquid Fund - Growth', invested: 80000, current: 83400 },
];

function generatePDF() {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(0, 102, 51);
  doc.text('SUTRAFI', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('CAMS Mutual Fund Statement (Demo)', 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 105, 38, { align: 'center' });
  doc.text('Investor: JOHN DOE | PAN: XXXXXX1234X', 105, 44, { align: 'center' });
  
  const totalInvested = funds.reduce((sum, f) => sum + f.invested, 0);
  const totalCurrent = funds.reduce((sum, f) => sum + f.current, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalReturn = ((totalGain / totalInvested) * 100).toFixed(2);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 50, 190, 20, 'F');
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Invested: Rs. ${totalInvested.toLocaleString('en-IN')}`, 15, 58);
  doc.text(`Current Value: Rs. ${totalCurrent.toLocaleString('en-IN')}`, 105, 58);
  doc.text(`Total Gain: Rs. ${totalGain.toLocaleString('en-IN')} (${totalReturn}%)`, 15, 66);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 80, 0);
  doc.text('#  Scheme Name                          Invested    Current      Return', 12, 80);
  doc.line(10, 82, 200, 82);
  
  let y = 88;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  funds.forEach((fund, index) => {
    const returnPct = (((fund.current - fund.invested) / fund.invested) * 100).toFixed(1);
    const returnColor = fund.current >= fund.invested ? [0, 128, 0] : [220, 53, 69];
    
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}.`, 12, y);
    
    const shortName = fund.name.length > 35 ? fund.name.substring(0, 32) + '...' : fund.name;
    doc.text(shortName, 18, y);
    
    doc.text(`Rs. ${fund.invested.toLocaleString('en-IN')}`, 125, y);
    doc.text(`Rs. ${fund.current.toLocaleString('en-IN')}`, 155, y);
    
    doc.setTextColor(returnColor[0], returnColor[1], returnColor[2]);
    doc.text(`${returnPct}%`, 182, y);
    
    y += 6;
    
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a demo statement for testing purposes only.', 105, 290, { align: 'center' });
  doc.text('Generated by Sutrafi - Money Mentor', 105, 295, { align: 'center' });
  
  doc.save('Sutrafi-Demo-CAMS-Statement.pdf');
}

export default function DownloadCAMSPage() {
  const navigate = useNavigate();

  useEffect(() => {
    generatePDF();
    setTimeout(() => {
      navigate('/cams');
    }, 1500);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Downloading Demo CAMS Statement
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your PDF is being generated and will download automatically...
        </p>

        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">PDF Ready!</span>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          If download doesn't start,{' '}
          <button 
            onClick={generatePDF}
            className="text-green-600 underline font-medium"
          >
            click here
          </button>
        </p>

        <button
          onClick={() => navigate('/cams')}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Back to Portfolio X-Ray
        </button>
      </div>
    </div>
  );
}
