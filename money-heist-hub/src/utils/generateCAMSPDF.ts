import jsPDF from 'jspdf';

const funds = [
  { folio: 'ABC1234567890', name: 'HDFC Flexicap Fund - Growth', invested: 100000, current: 145000 },
  { folio: 'ABC1234567890', name: 'HDFC Mid Cap Opportunities Fund - Growth', invested: 50000, current: 72000 },
  { folio: 'XYZ9876543210', name: 'ICICI Prudential Bluechip Fund - Growth', invested: 75000, current: 98500 },
  { folio: 'XYZ9876543210', name: 'ICICI Prudential Liquid Fund - Growth', invested: 200000, current: 215000 },
  { folio: 'PQR4567890123', name: 'SBI Small Cap Fund - Regular Plan - Growth', invested: 60000, current: 78000 },
  { folio: 'PQR4567890123', name: 'SBI Equity Hybrid Fund - Growth', invested: 80000, current: 92000 },
  { folio: 'MNO1112223334', name: 'Axis Bluechip Fund - Growth', invested: 50000, current: 58500 },
  { folio: 'MNO1112223334', name: 'Axis Long Term Equity Fund - ELSS', invested: 50000, current: 68000 },
  { folio: 'DEF5556667778', name: 'Nippon India Growth Fund - Growth', invested: 40000, current: 52000 },
  { folio: 'DEF5556667778', name: 'Nippon India Liquid Fund - Growth', invested: 100000, current: 106000 },
  { folio: 'GHI9990001112', name: 'UTI Flexi Cap Fund - Growth', invested: 70000, current: 89000 },
  { folio: 'GHI9990001112', name: 'UTI Nifty Index Fund - Growth', invested: 30000, current: 38000 },
  { folio: 'JKL2223334445', name: 'Kotak Emerging Equity Fund - Growth', invested: 45000, current: 58000 },
  { folio: 'JKL2223334445', name: 'Kotak Liquid Fund - Growth', invested: 150000, current: 158000 },
  { folio: 'MNO4445556667', name: 'Mirae Asset Large Cap Fund - Growth', invested: 55000, current: 72000 },
  { folio: 'MNO4445556667', name: 'Mirae Asset Hybrid Equity Fund - Growth', invested: 60000, current: 68000 },
  { folio: 'PQR7778889990', name: 'Tata Hybrid Equity Fund - Growth', invested: 70000, current: 82000 },
  { folio: 'PQR7778889990', name: 'Tata Liquid Fund - Growth', invested: 80000, current: 84200 },
  { folio: 'STU1112223334', name: 'Aditya Birla Frontline Equity Fund - Growth', invested: 50000, current: 64000 },
  { folio: 'STU1112223334', name: 'Aditya Birla Tax Relief 96 - ELSS', invested: 50000, current: 72000 },
  { folio: 'VWX4445556667', name: 'DSP Tax Saver Fund - ELSS', invested: 50000, current: 68000 },
  { folio: 'VWX4445556667', name: 'DSP Liquid Fund - Growth', invested: 120000, current: 126000 },
  { folio: 'YZA7778889990', name: 'Sundaram Large Cap Fund - Growth', invested: 40000, current: 49000 },
  { folio: 'YZA7778889990', name: 'Sundaram Debt Bond Fund - Growth', invested: 60000, current: 64800 },
  { folio: 'BCD1112223334', name: 'L&T India Value Fund - Growth', invested: 55000, current: 69000 },
  { folio: 'BCD1112223334', name: 'L&T Liquid Fund - Growth', invested: 90000, current: 94500 },
  { folio: 'EFG4445556667', name: 'Quant Active Fund - Growth', invested: 50000, current: 68000 },
  { folio: 'EFG4445556667', name: 'Quant Liquid Fund - Growth', invested: 100000, current: 104500 },
  { folio: 'HIJ7778889990', name: 'Bandhan Sterling Value Fund - Growth', invested: 45000, current: 56000 },
  { folio: 'HIJ7778889990', name: 'Bandhan Liquid Fund - Growth', invested: 80000, current: 83400 },
];

export function generateCAMSPDF() {
  try {
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
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
}
