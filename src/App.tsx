/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Users, Mail, Phone, Globe, Star, MapPin, 
  Sparkles, Download, ArrowLeft, RefreshCw, 
  AlertCircle, Compass, HelpCircle, Flame, ShieldAlert 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Lead, SearchQuery, Statistics, CRMNote } from "./types";
import SearchForm from "./components/SearchForm";
import LeadsTable from "./components/LeadsTable";
import LeadDrawer from "./components/LeadDrawer";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  // Navigation stream states
  const [activeStep, setActiveStep] = useState<'search' | 'loading' | 'results' | 'empty' | 'error'>('search');
  const [query, setQuery] = useState<SearchQuery | null>(null);
  
  // Leads core state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [apiSource, setApiSource] = useState<'gemini' | 'procedural' | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Progressive loading experiences states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStatusMessage, setCurrentStatusMessage] = useState("");

  // Loading steps rotations
  useEffect(() => {
    if (!isLoading) return;

    const messages = [
      { prg: 5, msg: "Connecting to Lead Finder SaaS indexers..." },
      { prg: 22, msg: "Searching local business registers..." },
      { prg: 45, msg: "Extracting verified emails and contact nodes..." },
      { prg: 68, msg: "Organizing statistical indicators & directories..." },
      { prg: 88, msg: "Synthesizing CRM notes and visual graphs..." },
      { prg: 98, msg: "Formulating targets dashboard..." }
    ];

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = Math.min(prev + 1, 100);
        
        // Pick the closest matched status message
        const matched = messages.reverse().find(m => next >= m.prg);
        if (matched) {
          setCurrentStatusMessage(matched.msg);
        }
        messages.reverse(); // reset sorting layout back

        if (next >= 100) {
          clearInterval(timer);
        }
        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Lead Finder Prospect Action
  const handleLeadSearch = async (searchQuery: SearchQuery) => {
    setQuery(searchQuery);
    setIsLoading(true);
    setActiveStep('loading');
    setLoadingProgress(0);

    try {
      const response = await fetch("/api/generate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchQuery),
      });

      if (!response.ok) {
        throw new Error("Unable to contact backend directory node");
      }

      const data = await response.json();
      
      // Delay transition briefly so the user experiences the beautiful status messages
      setTimeout(() => {
        setIsLoading(false);
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
          setApiSource(data.source || 'procedural');
          setActiveStep('results');
        } else {
          setActiveStep('empty');
        }
      }, 3500);

    } catch (err) {
      console.error("Prospecting query search error:", err);
      setTimeout(() => {
        setIsLoading(false);
        setActiveStep('error');
      }, 3000);
    }
  };

  // State reducers for lead status modification
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, status: newStatus };
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
        return updated;
      }
      return lead;
    }));
  };

  // State reducers for Lead Notes Manipulation
  const handleAddNote = (leadId: string, noteContent: string) => {
    const newNoteObj: CRMNote = {
      id: `note-added-${Date.now()}`,
      createdAt: new Date().toISOString(),
      content: noteContent
    };

    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, notes: [newNoteObj, ...lead.notes] };
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
        return updated;
      }
      return lead;
    }));
  };

  const handleDeleteNote = (leadId: string, noteId: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, notes: lead.notes.filter(n => n.id !== noteId) };
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
        return updated;
      }
      return lead;
    }));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    if (selectedLead?.id === leadId) {
      setSelectedLead(null);
    }
  };

  const handleResetSearch = () => {
    setActiveStep('search');
    setQuery(null);
    setLeads([]);
  };

  // Calculate live analytics variables for statistics block
  const calculateStatistics = (): Statistics => {
    if (leads.length === 0) return { totalLeads: 0, emailsFound: 0, phonesFound: 0, websitesFound: 0, averageRating: 0, citiesCovered: 0 };
    
    const emailsCount = leads.filter(l => l.email && l.email.includes("@")).length;
    const phonesCount = leads.filter(l => l.phone && l.phone.length > 5).length;
    const webCount = leads.filter(l => l.website && l.website.length > 5).length;
    const totalRating = leads.reduce((sum, l) => sum + l.rating, 0);
    const uniqueCities = new Set(leads.map(l => l.city.toLowerCase())).size;

    return {
      totalLeads: leads.length,
      emailsFound: emailsCount,
      phonesFound: phonesCount,
      websitesFound: webCount,
      averageRating: parseFloat((totalRating / leads.length).toFixed(1)) || 0,
      citiesCovered: uniqueCities
    };
  };

  const stats = calculateStatistics();

  // Bulletproof Data format exporters
  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    if (leads.length === 0) return;

    if (format === 'json') {
      const jsonStr = JSON.stringify(leads, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leadfinder_export_${query?.city}_${query?.niche}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    else if (format === 'csv' || format === 'excel') {
      const headers = ["Business Name", "Category", "City", "Phone", "Email", "Website", "Rating", "Reviews", "Address", "Status", "Description"];
      const rows = leads.map(l => [
        `"${l.businessName.replace(/"/g, '""')}"`,
        `"${l.category}"`,
        `"${l.city}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.website}"`,
        l.rating,
        l.reviews,
        `"${l.address.replace(/"/g, '""')}"`,
        `"${l.status}"`,
        `"${l.description.replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leadfinder_export_${query?.city}_${query?.niche}.${format === 'excel' ? 'xls' : 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased flex SelectionBox selection:bg-[#16A34A]/20 selection:text-[#16A34A] overflow-hidden">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Core Body stage */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Header 
          title={activeTab === 'home' ? 'Dashboard' : 'Lead Search'} 
        />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 pb-20">
          <div className="max-w-[1440px] mx-auto">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: LEAD SEARCHING CARD */}
              {activeStep === 'search' && activeTab === 'home' && (
                <motion.div
              key="search-stage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-12"
            >
              {/* Hero Banner Text */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A]"
                  id="hero-header-title"
                >
                  Find High Quality <span className="text-[#16A34A]">Leads</span> Instantly
                </motion.h1>
                <p className="text-[#64748B] text-base sm:text-lg font-medium max-w-lg mx-auto leading-relaxed">
                  Generate hyper-targeted B2B prospects using automated local directory filters.
                </p>
              </div>

              {/* Search Core layout panel */}
              <SearchForm onSearch={handleLeadSearch} isLoading={isLoading} />
            </motion.div>
          )}

          {/* STEP 2: PROFESSIONAL LOADING EXP */}
          {activeStep === 'loading' && activeTab === 'home' && (
            <motion.div
              key="loading-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[440px] text-center max-w-md mx-auto space-y-8"
              id="loading-spinner-panel"
            >
              {/* Custom SVG radar concentric loader rings */}
              <div className="relative flex items-center justify-center h-28 w-28">
                {/* Outermost animated halo */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#16A34A] opacity-40"
                />
                
                {/* Secondary inverse pulse halo */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                  className="absolute inset-2 rounded-full border-2 border-dotted border-emerald-400 opacity-60"
                />

                {/* Core spinning orbit */}
                <div className="absolute inset-5 rounded-full border-4 border-[#E2E8F0] border-t-[#16A34A] animate-spin h-18 w-18" />

                {/* Center visual check indicator */}
                <Compass className="absolute h-7 w-7 text-[#16A34A] animate-pulse" />
              </div>

              <div className="space-y-3.5">
                <h3 className="font-sans text-lg font-bold text-[#0F172A]">
                  Discovering Prospective Targets
                </h3>
                <p className="text-xs font-semibold text-[#64748B] font-mono tracking-wide h-6 bg-slate-100 rounded-lg px-4.5 py-1.5 inline-flex items-center justify-center border border-slate-200/50">
                  {currentStatusMessage}
                </p>
              </div>

              {/* Progressive loading percentage track bar */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[11px] font-mono font-bold text-[#64748B]">
                  <span>PROGRESS STATUS</span>
                  <span className="text-[#16A34A]">{loadingProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/15">
                  <motion.div 
                    className="h-full bg-[#16A34A] rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block pt-1 animate-pulse">
                  System gathering contact data indexes...
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CRM RESULTS DASHBOARD OVERVIEW */}
          {activeStep === 'results' && activeTab === 'home' && (
            <motion.div
              key="results-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Dashboard header block */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6">
                <div>
                  <button 
                    onClick={handleResetSearch}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#16A34A] mb-2 focus:outline-none"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" /> Start New Lookup
                  </button>
                  <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#0F172A] flex items-center gap-2">
                    Search Results: <span className="text-[#16A34A]">{query?.niche}</span> in <span className="text-slate-600 font-medium">{query?.city}</span>
                  </h1>
                </div>

                {/* Exporter menu triggers */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 mr-2 hidden sm:inline uppercase tracking-widest">
                    Bulk Export:
                  </span>
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-bold text-[#0F172A] transition-colors hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    <Download className="h-4 w-4 text-[#16A34A]" /> Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-bold text-[#0F172A] transition-colors hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    <Download className="h-4 w-4 text-[#16A34A]" /> Export Excel
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-bold text-[#0F172A] transition-colors hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    <Download className="h-4 w-4 text-[#16A34A]" /> Export JSON
                  </button>
                </div>
              </div>

              {/* Statistics cards grid section */}
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6" id="dashboard-statistics">
                
                {/* Metric Card 1 */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4.5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Total Leads</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none block">{stats.totalLeads}</span>
                    <span className="text-[10px] font-mono font-semibold text-[#16A34A] mt-1 block">100% complete</span>
                  </div>
                </div>

                {/* Metric Card 2 */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4.5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Emails Found</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                      <Mail className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none block">{stats.emailsFound}</span>
                    <span className="text-[10px] font-mono font-semibold text-[#16A34A] mt-1 block">
                      {Math.round((stats.emailsFound / stats.totalLeads) * 100)}% fill rate
                    </span>
                  </div>
                </div>

                {/* Metric Card 3 */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4.5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Phone Numbers</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                      <Phone className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none block">{stats.phonesFound}</span>
                    <span className="text-[10px] font-mono font-semibold text-[#16A34A] mt-1 block">
                      {Math.round((stats.phonesFound / stats.totalLeads) * 100)}% reach rate
                    </span>
                  </div>
                </div>

                {/* Metric Card 4 */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4.5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Websites</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none block">{stats.websitesFound}</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 mt-1 block">100% indexed</span>
                  </div>
                </div>

                {/* Metric Card 5 */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4.5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Avg Rating</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none block">{stats.averageRating} ★</span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-600 mt-1 block">Highly trusted</span>
                  </div>
                </div>

                {/* Metric Card 6 */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4.5 shadow-xs flex flex-col justify-between hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Cities covered</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[#0F172A]">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none block">{stats.citiesCovered}</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 mt-1 block">Target boundary</span>
                  </div>
                </div>

              </div>

              {/* Data CRM representation table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans text-lg font-bold tracking-tight text-[#0F172A]">
                    Lead Directory
                  </h3>
                  <span className="text-xs font-semibold text-[#64748B]">
                    Click row to launch detail panel
                  </span>
                </div>
                
                <LeadsTable
                  leads={leads}
                  onSelectLead={setSelectedLead}
                  onUpdateLeadStatus={handleUpdateLeadStatus}
                  onDeleteLead={handleDeleteLead}
                />
              </div>

              {/* Dynamic Interactive Analytics graphs module */}
              <div className="space-y-4 pt-4 border-t border-slate-200/60">
                <h3 className="font-sans text-lg font-bold tracking-tight text-[#0F172A]">
                  Analytics Insights
                </h3>
                <AnalyticsDashboard leads={leads} />
              </div>

            </motion.div>
          )}

          {/* STEP 4: EMPTY STATE */}
          {activeStep === 'empty' && activeTab === 'home' && (
            <motion.div
              key="empty-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto space-y-5"
              id="empty-state-panel"
            >
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Compass className="h-10 w-10 animate-pulse" />
                </div>
                <Users className="absolute h-5 w-5 text-slate-300 right-0 bottom-0 bg-white rounded-full p-0.5" />
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-lg font-bold text-[#0F172A]">No Leads Found</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-semibold">
                  We scanned target indexes but couldn't retrieve values. Try entering another city or broadening your category niche to generate results.
                </p>
              </div>

              <button
                onClick={handleResetSearch}
                className="w-full rounded-xl bg-[#16A34A] text-white font-semibold py-3 px-4 text-xs transition-colors hover:bg-[#15803d]"
              >
                Start New Search
              </button>
            </motion.div>
          )}

          {/* STEP 5: ERROR STATE */}
          {activeStep === 'error' && activeTab === 'home' && (
            <motion.div
              key="error-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto space-y-5"
              id="error-state-panel"
            >
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <ShieldAlert className="h-10 w-10" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-lg font-bold text-[#0F172A]">Something Went Wrong</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-semibold">
                  We encountered an authentication obstacle or database network anomaly while retrieving leads. Click below to re-verify connectivity.
                </p>
              </div>

              <button
                onClick={handleResetSearch}
                className="w-full rounded-xl bg-[#0F172A] text-white font-semibold py-3 px-4 text-xs transition-colors hover:bg-slate-800"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* FALLBACK BLANK SLATE FOR OTHER TABS */}
          {activeTab !== 'home' && (
             <motion.div
              key="blank-slate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-6"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex flex-col items-center justify-center text-slate-300">
                <Compass className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#0F172A] capitalize">{activeTab} Module</h2>
                <p className="text-sm font-semibold text-[#64748B] leading-relaxed">
                  This section is currently under development. Switch back to the Dashboard to continue prospecting.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('home')}
                className="px-6 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-sm transition-colors"
                >
                  Return to Dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
          </div>
        </main>

        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </div>
  );
}
