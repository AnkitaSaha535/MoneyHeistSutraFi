import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from 'pdfjs-dist';
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, GitMerge, Calculator, Brain,
  AlertTriangle, CheckCircle, ArrowRight, DollarSign, PieChart as PieChartIcon,
  Plus, Trash2, RefreshCw, Sparkles, Target, Zap, Shield, Upload, FileText, Download
} from "lucide-react";
import {
  calculateXIRR,
  calculateFundOverlap,
  compareExpenseRatios,
  generateRebalanceRecommendations,
  calculatePortfolioMetrics,
  generateAIInsights,
  savePortfolioData,
  loadPortfolioData,
  type PortfolioFund,
  type PortfolioData,
  type RebalanceRecommendation,
  type FundOverlap
} from "@/data/engine";

const CATEGORY_COLORS: Record<string, string> = {
  equity: '#FF6B6B',
  debt: '#4ECDC4',
  hybrid: '#45B7D1',
  liquid: '#96CEB4',
  elss: '#FFEAA7',
  index: '#DDA0DD',
  sector: '#F8B500'
};

interface CashFlowEntry {
  date: string;
  amount: number;
  type: 'invest' | 'redeem';
}

export default function CAMSPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(() => loadPortfolioData());
  const [showAddFund, setShowAddFund] = useState(false);
  const [showXIRR, setShowXIRR] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];
  const [cashFlows, setCashFlows] = useState<CashFlowEntry[]>([
    { date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: -50000, type: 'invest' },
    { date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], amount: -10000, type: 'invest' },
    { date: new Date().toISOString().split('T')[0], amount: 75000, type: 'redeem' },
  ]);
  const [newFund, setNewFund] = useState<Partial<PortfolioFund>>({
    name: '',
    category: 'equity',
    nav: 0,
    units: 0,
    purchaseDate: '',
    purchaseNav: 0,
    expenseRatio: 0.65,
    fundHouse: ''
  });

  const [targetAllocation, setTargetAllocation] = useState({
    equity: 60,
    debt: 30,
    gold: 5,
    cash: 5
  });

  const metrics = useMemo(() => {
    if (!portfolio) return null;
    return calculatePortfolioMetrics(portfolio);
  }, [portfolio]);

  const overlaps = useMemo(() => {
    if (!portfolio) return [];
    return calculateFundOverlap(portfolio.funds);
  }, [portfolio]);

  const expenseComparison = useMemo(() => {
    if (!portfolio) return [];
    return compareExpenseRatios(portfolio.funds);
  }, [portfolio]);

  const recommendations = useMemo(() => {
    if (!portfolio) return [];
    return generateRebalanceRecommendations(portfolio, targetAllocation);
  }, [portfolio, targetAllocation]);

  const aiInsights = useMemo(() => {
    if (!portfolio) return [];
    return generateAIInsights(portfolio, recommendations);
  }, [portfolio, recommendations]);

  const xirrResult = useMemo(() => {
    return calculateXIRR(cashFlows.map(cf => ({ date: cf.date, amount: cf.amount })));
  }, [cashFlows]);

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics.categoryBreakdown).map(([category, data]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: data.value,
      percentage: data.percentage
    }));
  }, [metrics]);

  const addFund = () => {
    if (!newFund.name || !newFund.nav || !newFund.units || !newFund.purchaseDate || !newFund.purchaseNav) return;

    const fund: PortfolioFund = {
      id: Date.now().toString(),
      name: newFund.name!,
      category: newFund.category as PortfolioFund['category'],
      nav: newFund.nav!,
      units: newFund.units!,
      purchaseDate: newFund.purchaseDate!,
      purchaseNav: newFund.purchaseNav!,
      currentValue: newFund.nav! * newFund.units!,
      investedValue: newFund.purchaseNav! * newFund.units!,
      gainLoss: (newFund.nav! - newFund.purchaseNav!) * newFund.units!,
      gainLossPercent: ((newFund.nav! - newFund.purchaseNav!) / newFund.purchaseNav!) * 100,
      expenseRatio: newFund.expenseRatio || 0.65,
      fundHouse: newFund.fundHouse || 'Unknown',
      holdings: [],
      sectors: []
    };

    const updatedPortfolio: PortfolioData = portfolio ? {
      ...portfolio,
      funds: [...portfolio.funds, fund],
      totalValue: (portfolio.totalValue || 0) + fund.currentValue,
      totalInvested: (portfolio.totalInvested || 0) + fund.investedValue,
      lastUpdated: new Date().toISOString()
    } : {
      funds: [fund],
      totalValue: fund.currentValue,
      totalInvested: fund.investedValue,
      totalGainLoss: fund.gainLoss,
      totalGainLossPercent: fund.gainLossPercent,
      sipAmount: 0,
      lastUpdated: new Date().toISOString()
    };

    updatedPortfolio.totalGainLoss = updatedPortfolio.totalValue - updatedPortfolio.totalInvested;
    updatedPortfolio.totalGainLossPercent = (updatedPortfolio.totalGainLoss / updatedPortfolio.totalInvested) * 100;

    setPortfolio(updatedPortfolio);
    savePortfolioData(updatedPortfolio);
    setShowAddFund(false);
    setNewFund({
      name: '',
      category: 'equity',
      nav: 0,
      units: 0,
      purchaseDate: '',
      purchaseNav: 0,
      expenseRatio: 0.65,
      fundHouse: ''
    });
  };

  const removeFund = (fundId: string) => {
    if (!portfolio) return;
    const updatedFunds = portfolio.funds.filter(f => f.id !== fundId);
    const updatedPortfolio = {
      ...portfolio,
      funds: updatedFunds,
      totalValue: updatedFunds.reduce((sum, f) => sum + f.currentValue, 0),
      totalInvested: updatedFunds.reduce((sum, f) => sum + f.investedValue, 0),
      lastUpdated: new Date().toISOString()
    };
    updatedPortfolio.totalGainLoss = updatedPortfolio.totalValue - updatedPortfolio.totalInvested;
    updatedPortfolio.totalGainLossPercent = (updatedPortfolio.totalGainLoss / updatedPortfolio.totalInvested) * 100;
    setPortfolio(updatedPortfolio);
    savePortfolioData(updatedPortfolio);
  };

  const addCashFlow = () => {
    setCashFlows([...cashFlows, { date: new Date().toISOString().split('T')[0], amount: 0, type: 'invest' }]);
  };

  const updateCashFlow = (index: number, field: keyof CashFlowEntry, value: string | number) => {
    const updated = [...cashFlows];
    updated[index] = { ...updated[index], [field]: value };
    setCashFlows(updated);
  };

  const removeCashFlow = (index: number) => {
    setCashFlows(cashFlows.filter((_, i) => i !== index));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setUploadError('');
    }
  };

  const parseCAMSFile = async (file: File): Promise<PortfolioFund[]> => {
    let text: string;
    
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      text = fullText;
    } else {
      text = await file.text();
    }
    
    const lines = text.split(/[\n\r]+/).filter(line => line.trim());
    const funds: PortfolioFund[] = [];
    const fundNamePattern = /(?:HDFC|ICICI|SBI|Nippon|Mirae|Axis|UTI|Kotak|Parag|Parimal|Sunlife|DSP|Tata|Aditya Birla|Sundaram|L&T|Navi|Mahindra|Quant|IIFL|Mirae|Taurus|Bandhan|Exide|Torc)/i;
    
    for (const line of lines) {
      const cleanLine = line.replace(/\s+/g, ' ').trim();
      
      if (!fundNamePattern.test(cleanLine)) continue;
      
      const numbers = cleanLine.match(/[\d,]+\.?\d*/g) || [];
      const amounts = numbers.map(n => parseFloat(n.replace(/,/g, ''))).filter(n => !isNaN(n) && n > 0);
      
      let name = '';
      const nameMatch = cleanLine.match(/(?:Growth|Regular|Dividend|Payout|Reinvestment)?\s*(?:Fund|Scheme|Plan)?\s*[-:]?\s*([A-Za-z\s]+(?:Fund|Scheme|ETF|Plan))/i);
      if (nameMatch) {
        name = nameMatch[1].trim();
      } else {
        const words = cleanLine.split(' ').slice(0, 4);
        name = words.join(' ');
      }
      
      if (!name || name.length < 5) continue;
      
      const balance = amounts.length > 0 ? amounts[amounts.length - 1] : 0;
      const units = amounts.length > 1 ? amounts[amounts.length - 2] : 0;
      const nav = units > 0 && balance > 0 ? balance / units : 0;
      
      if (units > 0 && balance > 100) {
        const purchaseNav = nav > 0 ? balance / units : 0;
        const gainLoss = balance - (purchaseNav * units);
        const gainLossPercent = purchaseNav > 0 ? ((nav - purchaseNav) / purchaseNav) * 100 : 0;
        
        let category: PortfolioFund['category'] = 'equity';
        const lowerName = name.toLowerCase();
        if (lowerName.includes('liquid') || lowerName.includes('overnight') || lowerName.includes('money market')) category = 'liquid';
        else if (lowerName.includes('debt') || lowerName.includes('bond') || lowerName.includes('income') || lowerName.includes('credit risk')) category = 'debt';
        else if (lowerName.includes('hybrid') || lowerName.includes('balanced') || lowerName.includes('conservative')) category = 'hybrid';
        else if (lowerName.includes('elss') || lowerName.includes('tax saver')) category = 'elss';
        else if (lowerName.includes('index') || lowerName.includes('nifty') || lowerName.includes('sensex') || lowerName.includes('etf')) category = 'index';
        else if (lowerName.includes('sector') || lowerName.includes('thematic') || lowerName.includes('industry')) category = 'sector';
        else if (lowerName.includes('gold') || lowerName.includes('silver')) category = 'hybrid';
        
        let fundHouse = 'AMC';
        if (/HDFC/i.test(name)) fundHouse = 'HDFC AMC';
        else if (/ICICI/i.test(name)) fundHouse = 'ICICI Prudential';
        else if (/SBI/i.test(name)) fundHouse = 'SBI MF';
        else if (/Axis/i.test(name)) fundHouse = 'Axis AMC';
        else if (/UTI/i.test(name)) fundHouse = 'UTI AMC';
        else if (/Kotak/i.test(name)) fundHouse = 'Kotak AMC';
        else if (/Nippon/i.test(name)) fundHouse = 'Nippon India';
        else if (/Mirae/i.test(name)) fundHouse = 'Mirae Asset';
        else if (/Tata/i.test(name)) fundHouse = 'Tata AMC';
        else if (/Aditya Birla/i.test(name)) fundHouse = 'Aditya Birla';
        else if (/DSP/i.test(name)) fundHouse = 'DSP AMC';
        
        funds.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: name.substring(0, 50),
          category,
          nav: Math.round(nav * 100) / 100,
          units: Math.round(units * 100) / 100,
          purchaseDate: new Date().toISOString().split('T')[0],
          purchaseNav: Math.round(purchaseNav * 100) / 100,
          currentValue: Math.round(balance * 100) / 100,
          investedValue: Math.round(purchaseNav * units * 100) / 100,
          gainLoss: Math.round(gainLoss * 100) / 100,
          gainLossPercent: Math.round(gainLossPercent * 100) / 100,
          expenseRatio: 0.65,
          fundHouse,
          holdings: [],
          sectors: []
        });
      }
    }
    
    return funds;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadStatus('parsing');
    setUploadProgress(0);
    setUploadError('');
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);
    
    try {
      const funds = await parseCAMSFile(selectedFile);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (funds.length === 0) {
        setUploadStatus('error');
        setUploadError('No valid fund data found. Please upload a valid CAMS/KFintech CSV statement.');
        return;
      }
      
      const updatedPortfolio: PortfolioData = portfolio ? {
        ...portfolio,
        funds: [...portfolio.funds, ...funds],
        totalValue: portfolio.totalValue + funds.reduce((sum, f) => sum + f.currentValue, 0),
        totalInvested: portfolio.totalInvested + funds.reduce((sum, f) => sum + f.investedValue, 0),
        lastUpdated: new Date().toISOString()
      } : {
        funds,
        totalValue: funds.reduce((sum, f) => sum + f.currentValue, 0),
        totalInvested: funds.reduce((sum, f) => sum + f.investedValue, 0),
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        sipAmount: 0,
        lastUpdated: new Date().toISOString()
      };
      
      updatedPortfolio.totalGainLoss = updatedPortfolio.totalValue - updatedPortfolio.totalInvested;
      updatedPortfolio.totalGainLossPercent = updatedPortfolio.totalGainLoss / updatedPortfolio.totalInvested * 100;
      
      setPortfolio(updatedPortfolio);
      savePortfolioData(updatedPortfolio);
      setUploadStatus('success');
      setTimeout(() => {
        setShowUpload(false);
        setSelectedFile(null);
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 1500);
    } catch {
      clearInterval(progressInterval);
      setUploadStatus('error');
      setUploadError('Failed to parse file. Please ensure it\'s a valid CAMS/KFintech CSV statement.');
    }
  };

  const pieChartData = chartData.map(cat => ({
    name: cat.name,
    value: cat.value,
    fill: CATEGORY_COLORS[cat.name.toLowerCase()] || '#8884d8'
  }));

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="cams" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2"
        >
          PORTFOLIO X-RAY
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8">Deep dive into your mutual fund portfolio with AI-powered insights</p>

        {!portfolio || portfolio.funds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heist-card p-12 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No Portfolio Data Yet</h3>
            <p className="text-muted-foreground mb-8">Add your mutual funds to get XIRR, overlap analysis, and AI recommendations</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => navigate('/download-cams')} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:from-amber-600 hover:to-yellow-600 shadow-lg">
                <Download className="w-5 h-5 mr-2" /> DOWNLOAD SAMPLE PDF
              </Button>
              <Button onClick={() => setShowAddFund(true)} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" /> ADD MANUAL
              </Button>
              <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-heist-cyan text-heist-cyan hover:bg-heist-cyan/20">
                    <Upload className="w-4 h-4 mr-2" /> UPLOAD YOUR STATEMENT
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="heist-title">UPLOAD CAMS/KFINTECH STATEMENT</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-heist-cyan transition-colors">
                      <input
                        type="file"
                        accept=".csv,.txt,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="cams-upload"
                      />
                      <label htmlFor="cams-upload" className="cursor-pointer">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-foreground font-medium mb-2">
                          {selectedFile ? selectedFile.name : 'Click to select statement'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports CSV, TXT & PDF (CAMS/KFintech)
                        </p>
                      </label>
                    </div>
                    
                    {uploadStatus === 'parsing' && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          Parsing your statement... {uploadProgress}%
                        </p>
                      </div>
                    )}
                    
                    {uploadStatus === 'success' && (
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Portfolio imported successfully!</span>
                      </div>
                    )}
                    
                    {uploadStatus === 'error' && (
                      <div className="flex items-start gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5 mt-0.5" />
                        <span className="text-sm">{uploadError}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadStatus === 'parsing'}
                        className="flex-1 bg-heist-cyan text-black font-bold"
                      >
                        {uploadStatus === 'parsing' ? 'PARSING...' : 'IMPORT PORTFOLIO'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setShowUpload(false); setSelectedFile(null); setUploadStatus('idle'); }}
                      >
                        CANCEL
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Your data stays local. We never upload files to any server.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground heist-mono">TOTAL VALUE</p>
                    <p className="text-2xl font-bold text-foreground">₹{metrics?.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heist-card p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${(metrics?.totalGainLoss || 0) >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {(metrics?.totalGainLoss || 0) >= 0 ? <TrendingUp className="w-6 h-6 text-green-500" /> : <TrendingDown className="w-6 h-6 text-red-500" />}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground heist-mono">TOTAL GAIN/LOSS</p>
                    <p className={`text-2xl font-bold ${(metrics?.totalGainLoss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ₹{Math.abs(metrics?.totalGainLoss || 0).toLocaleString()} ({(metrics?.totalGainLossPercent || 0).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="heist-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-heist-cyan/20 rounded-lg">
                    <Calculator className="w-6 h-6 text-heist-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground heist-mono">AVG XIRR</p>
                    <p className="text-2xl font-bold text-heist-cyan">{xirrResult.xirr.toFixed(2)}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="heist-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-heist-gold/20 rounded-lg">
                    <Brain className="w-6 h-6 text-heist-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground heist-mono">AI SCORE</p>
                    <p className="text-2xl font-bold text-heist-gold">{aiInsights.length > 0 ? Math.max(60, 100 - aiInsights.length * 10) : 100}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {aiInsights.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-heist-gold" />
                  <h3 className="heist-title text-xl">AI INSIGHTS</h3>
                </div>
                <div className="space-y-3">
                  {aiInsights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
                    >
                      <Zap className="w-5 h-5 text-heist-gold mt-0.5" />
                      <p className="text-sm text-foreground">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="heist-card p-1 flex flex-wrap gap-1">
                <TabsTrigger value="overview" className="heist-mono">
                  <PieChartIcon className="w-4 h-4 mr-2" /> OVERVIEW
                </TabsTrigger>
                <TabsTrigger value="xirr" className="heist-mono">
                  <Calculator className="w-4 h-4 mr-2" /> XIRR
                </TabsTrigger>
                <TabsTrigger value="overlap" className="heist-mono">
                  <GitMerge className="w-4 h-4 mr-2" /> OVERLAP
                </TabsTrigger>
                <TabsTrigger value="expense" className="heist-mono">
                  <Shield className="w-4 h-4 mr-2" /> EXPENSE RATIO
                </TabsTrigger>
                <TabsTrigger value="rebalance" className="heist-mono">
                  <Target className="w-4 h-4 mr-2" /> REBALANCE
                </TabsTrigger>
                <TabsTrigger value="funds" className="heist-mono">
                  <TrendingUp className="w-4 h-4 mr-2" /> FUNDS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-6">
                    <h3 className="heist-title text-lg mb-4">ALLOCATION BREAKDOWN</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heist-card p-6">
                    <h3 className="heist-title text-lg mb-4">PERFORMANCE BY FUND</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={portfolio.funds.map(f => ({
                          name: f.name.length > 15 ? f.name.substring(0, 15) + '...' : f.name,
                          returns: f.gainLossPercent
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} />
                          <YAxis tick={{ fill: '#888' }} />
                          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                          <Bar dataKey="returns" radius={[4, 4, 0, 0]}>
                            {portfolio.funds.map((f, i) => (
                              <Cell key={i} fill={f.gainLossPercent >= 0 ? '#22c55e' : '#ef4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="heist-card p-6 lg:col-span-2">
                    <h3 className="heist-title text-lg mb-4">CATEGORY ALLOCATION VS TARGET</h3>
                    <div className="space-y-4">
                      {Object.entries(targetAllocation).map(([category, target]) => {
                        const current = metrics?.categoryBreakdown[category]?.percentage || 0;
                        const diff = target - current;
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground font-bold capitalize">{category}</span>
                              <span className="text-muted-foreground">
                                Current: {current.toFixed(1)}% | Target: {target}% 
                                <span className={diff > 0 ? 'text-green-500 ml-2' : diff < 0 ? 'text-red-500 ml-2' : 'ml-2'}>
                                  ({diff > 0 ? '+' : ''}{diff.toFixed(1)}%)
                                </span>
                              </span>
                            </div>
                            <div className="relative">
                              <Progress value={current} className="h-3 bg-secondary" />
                              <div 
                                className="absolute top-0 h-3 border-l-2 border-dashed border-heist-gold"
                                style={{ left: `${target}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="xirr">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-6">
                    <h3 className="heist-title text-lg mb-4">CASH FLOW CALCULATOR</h3>
                    <div className="space-y-3 mb-6">
                      {cashFlows.map((cf, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Input
                            type="date"
                            value={cf.date}
                            onChange={(e) => updateCashFlow(i, 'date', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={cf.amount}
                            onChange={(e) => updateCashFlow(i, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-32"
                            placeholder="Amount"
                          />
                          <select
                            value={cf.type}
                            onChange={(e) => updateCashFlow(i, 'type', e.target.value)}
                            className="px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm"
                          >
                            <option value="invest">Invest</option>
                            <option value="redeem">Redeem</option>
                          </select>
                          <Button variant="ghost" size="icon" onClick={() => removeCashFlow(i)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={addCashFlow} className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> ADD CASH FLOW
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heist-card p-6">
                    <h3 className="heist-title text-lg mb-4">XIRR RESULT</h3>
                    <div className="text-center p-8">
                      <p className="text-sm text-muted-foreground mb-2">Extended Internal Rate of Return</p>
                      <motion.div
                        className="text-6xl font-bold mb-4"
                        style={{ color: xirrResult.xirr >= 0 ? '#22c55e' : '#ef4444' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                      >
                        {xirrResult.xirr.toFixed(2)}%
                      </motion.div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-secondary p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground">Ann. Return</p>
                          <p className="text-xl font-bold">{xirrResult.annualizedReturn.toFixed(2)}%</p>
                        </div>
                        <div className="bg-secondary p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground">Total Flows</p>
                          <p className="text-xl font-bold">{cashFlows.length}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="heist-card p-6 lg:col-span-2">
                    <h3 className="heist-title text-lg mb-4">CASH FLOW TIMELINE</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={xirrResult.cashFlows.map(cf => ({
                          date: new Date(cf.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                          amount: cf.amount
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="date" tick={{ fill: '#888' }} />
                          <YAxis tick={{ fill: '#888' }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="overlap">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <GitMerge className="w-6 h-6 text-primary" />
                    <h3 className="heist-title text-lg">FUND OVERLAP ANALYSIS</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    High overlap means your funds hold similar stocks, reducing diversification benefits.
                  </p>

                  {overlaps.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-foreground font-bold">No Overlap Detected</p>
                      <p className="text-sm text-muted-foreground">Your funds have good diversification</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {overlaps.map((overlap, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`p-4 rounded-lg border ${overlap.overlapPercent > 40 ? 'border-red-500 bg-red-500/10' : 'border-yellow-500/50 bg-yellow-500/10'}`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-foreground">{overlap.fund1}</p>
                              <p className="text-sm text-muted-foreground">overlaps with</p>
                              <p className="font-bold text-foreground">{overlap.fund2}</p>
                            </div>
                            <Badge variant={overlap.overlapPercent > 40 ? 'destructive' : 'secondary'}>
                              {overlap.overlapPercent}% Overlap
                            </Badge>
                          </div>
                          <div className="mb-3">
                            <Progress value={overlap.overlapPercent} className="h-2" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Common stocks: {overlap.commonStocks.slice(0, 5).join(', ')}
                            {overlap.commonStocks.length > 5 && ` +${overlap.commonStocks.length - 5} more`}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {overlaps.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="heist-card p-6">
                    <h3 className="heist-title text-lg mb-4">OVERLAP MATRIX</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={overlaps.map(o => ({
                            name: `${o.fund1.substring(0, 8)}...`,
                            overlap: o.overlapPercent
                          }))}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis type="number" tick={{ fill: '#888' }} />
                          <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 10 }} width={80} />
                          <Tooltip />
                          <Bar dataKey="overlap" radius={[0, 4, 4, 0]}>
                            {overlaps.map((o, i) => (
                              <Cell key={i} fill={o.overlapPercent > 40 ? '#ef4444' : '#f59e0b'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="expense">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-heist-cyan" />
                    <h3 className="heist-title text-lg">EXPENSE RATIO COMPARISON</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Lower expense ratios mean more returns in your pocket. Index funds typically have the lowest ratios.
                  </p>

                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={expenseComparison.map(e => ({
                        name: e.fund.length > 12 ? e.fund.substring(0, 12) + '...' : e.fund,
                        ratio: e.expenseRatio,
                        benchmark: e.category === 'index' ? 0.15 : e.category === 'equity' ? 0.65 : 0.50
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#888' }} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        <Legend />
                        <Bar dataKey="ratio" name="Actual" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="benchmark" name="Benchmark" fill="#4A90D9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {expenseComparison.map((exp, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">{exp.category}</Badge>
                          <span className="font-bold text-foreground">{exp.fund}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold" style={{ color: exp.expenseRatio < 0.5 ? '#22c55e' : exp.expenseRatio > 1 ? '#ef4444' : '#f59e0b' }}>
                            {exp.expenseRatio.toFixed(2)}%
                          </span>
                          <Badge variant={exp.comparison.includes('Excellent') ? 'default' : exp.comparison.includes('Poor') ? 'destructive' : 'secondary'}>
                            {exp.comparison}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="rebalance">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-heist-gold" />
                    <h3 className="heist-title text-lg">TARGET ALLOCATION</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(targetAllocation).map(([category, value]) => (
                      <div key={category} className="space-y-2">
                        <Label className="capitalize text-foreground">{category}</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => setTargetAllocation(prev => ({ ...prev, [category]: parseInt(e.target.value) || 0 }))}
                            className="w-20"
                            min={0}
                            max={100}
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heist-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-primary" />
                      <h3 className="heist-title text-lg">REBALANCING RECOMMENDATIONS</h3>
                    </div>

                    {recommendations.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-foreground font-bold">Portfolio is Balanced</p>
                        <p className="text-sm text-muted-foreground">No rebalancing needed at this time</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-lg border ${rec.priority === 'high' ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${rec.type === 'buy' ? 'bg-green-500/20' : rec.type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                {rec.type === 'buy' ? <TrendingUp className="w-5 h-5 text-green-500" /> :
                                 rec.type === 'sell' ? <TrendingDown className="w-5 h-5 text-red-500" /> :
                                 <ArrowRight className="w-5 h-5 text-blue-500" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                                    {rec.type.toUpperCase()}
                                  </Badge>
                                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                                    {rec.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-2">{rec.reason}</p>
                                {rec.amount > 0 && (
                                  <p className="text-xs text-muted-foreground">
                                    Amount: ₹{rec.amount.toLocaleString()}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">{rec.expectedImpact}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="heist-card p-6">
                    <h3 className="heist-title text-lg mb-4">CURRENT VS TARGET</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={[
                          { category: 'Equity', current: metrics?.categoryBreakdown['equity']?.percentage || 0, target: targetAllocation.equity },
                          { category: 'Debt', current: metrics?.categoryBreakdown['debt']?.percentage || 0, target: targetAllocation.debt },
                          { category: 'Gold', current: metrics?.categoryBreakdown['hybrid']?.percentage || 0, target: targetAllocation.gold },
                          { category: 'Cash', current: metrics?.categoryBreakdown['liquid']?.percentage || 0, target: targetAllocation.cash }
                        ]}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="category" tick={{ fill: '#888' }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#888' }} />
                          <Radar name="Current" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Radar name="Target" dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                          <Legend />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="funds">
                <div className="flex flex-wrap gap-4 justify-end mb-6">
                  <Dialog open={showUpload} onOpenChange={setShowUpload}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-heist-cyan text-heist-cyan hover:bg-heist-cyan/20">
                        <Upload className="w-4 h-4 mr-2" /> UPLOAD STATEMENT
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="heist-title">UPLOAD CAMS/KFINTECH STATEMENT</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-heist-cyan transition-colors">
                          <input
                            type="file"
                            accept=".csv,.txt,.pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="cams-upload-funds"
                          />
                          <label htmlFor="cams-upload-funds" className="cursor-pointer">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-foreground font-medium mb-2">
                              {selectedFile ? selectedFile.name : 'Click to select statement'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Supports CSV, TXT & PDF (CAMS/KFintech)
                            </p>
                          </label>
                        </div>
                        
                        {uploadStatus === 'parsing' && (
                          <div className="space-y-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-sm text-center text-muted-foreground">
                              Parsing your statement... {uploadProgress}%
                            </p>
                          </div>
                        )}
                        
                        {uploadStatus === 'success' && (
                          <div className="flex items-center justify-center gap-2 text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Portfolio imported successfully!</span>
                          </div>
                        )}
                        
                        {uploadStatus === 'error' && (
                          <div className="flex items-start gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5 mt-0.5" />
                            <span className="text-sm">{uploadError}</span>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadStatus === 'parsing'}
                            className="flex-1 bg-heist-cyan text-black font-bold"
                          >
                            {uploadStatus === 'parsing' ? 'PARSING...' : 'IMPORT PORTFOLIO'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => { setShowUpload(false); setSelectedFile(null); setUploadStatus('idle'); }}
                          >
                            CANCEL
                          </Button>
                        </div>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          Your data stays local. We never upload files to any server.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={showAddFund} onOpenChange={setShowAddFund}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary text-primary-foreground font-bold">
                        <Plus className="w-4 h-4 mr-2" /> ADD FUND
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="heist-title">ADD NEW FUND</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Fund Name</Label>
                          <Input placeholder="e.g. HDFC Flexicap" value={newFund.name} onChange={(e) => setNewFund({ ...newFund, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Category</Label>
                            <select
                              value={newFund.category}
                              onChange={(e) => setNewFund({ ...newFund, category: e.target.value as PortfolioFund['category'] })}
                              className="w-full px-3 py-2 bg-secondary border border-border rounded"
                            >
                              <option value="equity">Equity</option>
                              <option value="debt">Debt</option>
                              <option value="hybrid">Hybrid</option>
                              <option value="liquid">Liquid</option>
                              <option value="elss">ELSS</option>
                              <option value="index">Index</option>
                              <option value="sector">Sector</option>
                            </select>
                          </div>
                          <div>
                            <Label>Fund House</Label>
                            <Input placeholder="e.g. HDFC AMC" value={newFund.fundHouse} onChange={(e) => setNewFund({ ...newFund, fundHouse: e.target.value })} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Current NAV</Label>
                            <Input type="number" placeholder="100.50" value={newFund.nav || ''} onChange={(e) => setNewFund({ ...newFund, nav: parseFloat(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Units</Label>
                            <Input type="number" placeholder="500" value={newFund.units || ''} onChange={(e) => setNewFund({ ...newFund, units: parseFloat(e.target.value) })} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Purchase NAV</Label>
                            <Input type="number" placeholder="85.00" value={newFund.purchaseNav || ''} onChange={(e) => setNewFund({ ...newFund, purchaseNav: parseFloat(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Purchase Date</Label>
                            <Input type="date" value={newFund.purchaseDate || ''} onChange={(e) => setNewFund({ ...newFund, purchaseDate: e.target.value })} />
                          </div>
                        </div>
                        <div>
                          <Label>Expense Ratio (%)</Label>
                          <Input type="number" step="0.01" placeholder="0.65" value={newFund.expenseRatio || ''} onChange={(e) => setNewFund({ ...newFund, expenseRatio: parseFloat(e.target.value) })} />
                        </div>
                        <Button onClick={addFund} className="w-full bg-primary text-primary-foreground font-bold">
                          ADD FUND
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.funds.map((fund, i) => (
                    <motion.div
                      key={fund.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="heist-card p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Badge style={{ backgroundColor: CATEGORY_COLORS[fund.category], color: '#000' }} className="mb-2">
                            {fund.category.toUpperCase()}
                          </Badge>
                          <h4 className="font-bold text-foreground">{fund.name}</h4>
                          <p className="text-xs text-muted-foreground">{fund.fundHouse}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFund(fund.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Value</span>
                          <span className="font-bold text-foreground">₹{fund.currentValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Invested</span>
                          <span className="text-foreground">₹{fund.investedValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gain/Loss</span>
                          <span className={`font-bold ${fund.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ₹{Math.abs(fund.gainLoss).toLocaleString()} ({fund.gainLossPercent.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expense Ratio</span>
                          <span className={`${fund.expenseRatio > 1 ? 'text-red-500' : fund.expenseRatio < 0.5 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {fund.expenseRatio.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
