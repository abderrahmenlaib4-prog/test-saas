/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, 
  Copy, Check, ExternalLink, Mail, Phone, Globe, Star, MoreHorizontal, 
  Trash2, Filter, Eye, CheckCircle2 
} from "lucide-react";
import { Lead } from "../types";

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: Lead['status']) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function LeadsTable({ leads, onSelectLead, onUpdateLeadStatus, onDeleteLead }: LeadsTableProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [ratingFilter, setRatingFilter] = useState<string>("All");
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof Lead>("businessName");
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bulk Selection state
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  
  // Clipboard copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleRowClick = (lead: Lead) => {
    onSelectLead(lead);
  };

  // 1. Filtering logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    
    let matchesRating = true;
    if (ratingFilter === "4.5+") {
      matchesRating = lead.rating >= 4.5;
    } else if (ratingFilter === "4.0+") {
      matchesRating = lead.rating >= 4.0;
    } else if (ratingFilter === "3.5+") {
      matchesRating = lead.rating >= 3.5;
    }

    return matchesSearch && matchesStatus && matchesRating;
  });

  // 2. Sorting logic
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = (aVal as string).toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  // 3. Pagination logic
  const totalItems = sortedLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedLeads = sortedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // Bulk handlers
  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === paginatedLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(paginatedLeads.map(l => l.id));
    }
  };

  const handleToggleSelectOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleBulkStatusChange = (newStatus: Lead['status']) => {
    selectedLeadIds.forEach(id => {
      onUpdateLeadStatus(id, newStatus);
    });
    setSelectedLeadIds([]);
  };

  const handleBulkExportCSV = () => {
    const selectedLeadsToExport = leads.filter(l => selectedLeadIds.includes(l.id));
    const items = selectedLeadsToExport.length > 0 ? selectedLeadsToExport : filteredLeads;
    
    const headers = ["Business Name", "Category", "City", "Phone", "Email", "Website", "Rating", "Review Count", "Address", "Status"];
    const rows = items.map(l => [
      `"${l.businessName.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.city}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.website}"`,
      l.rating,
      l.reviews,
      `"${l.address.replace(/"/g, '""')}"`,
      `"${l.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leadfinder_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Search & CRM Filters Row */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4.5 shadow-sm shadow-[#0F172A]/2 md:flex-row md:items-center md:justify-between">
        
        {/* Search Input bar */}
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            id="table-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search leads..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 py-2.5 pl-9 pr-4 text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:border-[#16A34A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
          />
        </div>

        {/* Dropdown Filters and Sortings */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status filter selection */}
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-[#E2E8F0] bg-slate-50 px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] focus:border-[#16A34A] focus:outline-none"
            >
              <option value="All">All statuses</option>
              <option value="Prospect">Prospect</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Qualified">Qualified</option>
              <option value="Do Not Contact">Do Not Contact</option>
            </select>
          </div>

          {/* Rating filter selection */}
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <select
              id="rating-filter-select"
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-[#E2E8F0] bg-slate-50 px-3 py-2 text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] focus:border-[#16A34A] focus:outline-none"
            >
              <option value="All">All ratings</option>
              <option value="4.5+">★ 4.5 & up</option>
              <option value="4.0+">★ 4.0 & up</option>
              <option value="3.5+">★ 3.5 & up</option>
            </select>
          </div>

        </div>
      </div>

      {/* Bulk actions status panel */}
      {selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16A34A] text-white">
              <CheckCircle2 className="h-3 w-3" />
            </div>
            <span className="text-xs font-bold text-[#15803d]">
              {selectedLeadIds.length} leads selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Custom status selector */}
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkStatusChange(e.target.value as any);
                e.target.value = "";
              }}
              className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-[#16A34A] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
            >
              <option value="">Move Status...</option>
              <option value="Prospect">Prospect</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Qualified">Qualified</option>
              <option value="Do Not Contact">Do Not Contact</option>
            </select>
            <button
              onClick={handleBulkExportCSV}
              className="rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#15803d]"
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* DATA TABLE (Desktop design: md+) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm shadow-[#0F172A]/3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Sticky headers */}
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100/80 uppercase font-mono text-[10px] tracking-wider text-[#64748B]">
              <tr>
                <th className="py-4.5 px-5 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.length === paginatedLeads.length && paginatedLeads.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
                  />
                </th>
                <th className="py-4.5 px-4 font-bold cursor-pointer hover:text-[#16A34A] transition-colors" onClick={() => toggleSort("businessName")}>
                  <div className="flex items-center gap-1.5">
                    Business Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-4.5 px-4 font-bold cursor-pointer hover:text-[#16A34A] transition-colors" onClick={() => toggleSort("category")}>
                  <div className="flex items-center gap-1.5">
                    Niche/Category <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-4.5 px-4 font-bold cursor-pointer hover:text-[#16A34A] transition-colors" onClick={() => toggleSort("city")}>
                  City
                </th>
                <th className="py-4.5 px-4 font-bold w-40">Phone Info</th>
                <th className="py-4.5 px-4 font-bold max-w-[160px]">Contact Email</th>
                <th className="py-4.5 px-4 font-bold max-w-[100px]">Rating</th>
                <th className="py-4.5 px-4 font-bold cursor-pointer hover:text-[#16A34A] transition-colors" onClick={() => toggleSort("status")}>
                  Status
                </th>
                <th className="py-4.5 px-4 font-bold text-right pr-6 w-20">Link</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  return (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleRowClick(lead)}
                      className={`cursor-pointer hover:bg-slate-50/75 transition-all group ${isSelected ? 'bg-emerald-50/20' : ''}`}
                    >
                      {/* Bulk selection column */}
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectOne(e as any, lead.id)}
                          className="rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
                        />
                      </td>

                      {/* Business Name */}
                      <td className="py-4 px-4">
                        <div className="font-sans text-xs font-bold text-[#0F172A] group-hover:text-[#16A34A] transition-colors line-clamp-1">
                          {lead.businessName}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                          {lead.address}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block rounded-lg bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-700">
                          {lead.category}
                        </span>
                      </td>

                      {/* City */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-[#0F172A]">{lead.city}</div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-[#0F172A] font-mono leading-none">{lead.phone}</span>
                          <button
                            onClick={(e) => handleCopy(e, lead.phone)}
                            className="text-slate-300 hover:text-[#16A34A] rounded p-1"
                            title="Copy number"
                          >
                            {copiedText === lead.phone ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Primary Email */}
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 max-w-[150px]">
                          <span className="text-xs text-[#0F172A] font-mono leading-none truncate block" title={lead.email}>{lead.email}</span>
                          <button
                            onClick={(e) => handleCopy(e, lead.email)}
                            className="text-slate-300 hover:text-[#16A34A] rounded p-0.5 flex-shrink-0"
                            title="Copy email"
                          >
                            {copiedText === lead.email ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Rating Stars indicators */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#0F172A]">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>{lead.rating}</span>
                          <span className="text-slate-400 font-semibold font-sans">({lead.reviews})</span>
                        </div>
                      </td>

                      {/* CRM Badge Status */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold border leading-none focus:outline-none ${
                            lead.status === 'Prospect' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            lead.status === 'Meeting Scheduled' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="Prospect">Prospect</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Meeting Scheduled">Meeting</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Do Not Contact">DNC</option>
                        </select>
                      </td>

                      {/* Launch website external */}
                      <td className="py-4 px-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={lead.website}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#16A34A] hover:bg-slate-100 transition-colors"
                          title="Open website"
                        >
                          <Globe className="h-4.5 w-4.5" />
                        </a>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 border-none">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Search className="h-10 w-10 text-slate-300" />
                      <h4 className="mt-3 text-sm font-bold text-[#0F172A]">No Matching Leads Found</h4>
                      <p className="mt-1 text-xs text-slate-400 max-w-xs leading-normal">
                        No businesses meet the specified criteria. Try updating your table search or filters query.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE LEAD CARDS (md:hidden) */}
      <div className="grid gap-4 md:hidden">
        {paginatedLeads.length > 0 ? (
          paginatedLeads.map((lead) => (
            <div 
              key={lead.id} 
              onClick={() => handleRowClick(lead)}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-3 shadow-sm shadow-[#0F172A]/2 active:bg-slate-50 cursor-pointer"
            >
              {/* Header card line */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-[#64748B] uppercase tracking-wider block w-max">
                    {lead.category}
                  </span>
                  <h3 className="font-sans text-sm font-bold text-[#0F172A] mt-1 line-clamp-1">{lead.businessName}</h3>
                </div>
                
                {/* Visual Circle Rating */}
                <div className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-bold font-mono text-[#0F172A] border border-slate-100">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {lead.rating}
                </div>
              </div>

              {/* CRM Address info */}
              <p className="text-xs text-[#64748B] line-clamp-1 leading-normal">
                {lead.address}
              </p>

              {/* Status and Action Row */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2">
                <span className={`rounded-xl px-2.5 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                  lead.status === 'Prospect' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  lead.status === 'Meeting Scheduled' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {lead.status}
                </span>

                {/* Direct calling and copy buttons */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <a 
                    href={`mailto:${lead.email}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] hover:text-[#16A34A]"
                    title="Send Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a 
                    href={`tel:${lead.phone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] hover:text-[#16A34A]"
                    title="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <a 
                    href={lead.website} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748B] hover:text-[#16A34A]"
                    title="Website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 font-semibold bg-white">
            No prospects found matching filters.
          </div>
        )}
      </div>

      {/* Table Footer / Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 px-1.5 flex-wrap gap-2">
          <span className="text-xs font-semibold text-[#64748B]">
            Showing <strong className="text-[#0F172A] font-mono">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
            <strong className="text-[#0F172A] font-mono">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </strong>{" "}
            of <strong className="text-[#0F172A] font-mono">{totalItems}</strong> targets
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#64748B] hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 focus:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pIdx = idx + 1;
              return (
                <button
                  key={pIdx}
                  onClick={() => changePage(pIdx)}
                  className={`flex h-8.5 w-8.5 items-center justify-center rounded-xl text-xs font-bold font-mono select-none ${
                    currentPage === pIdx
                      ? "bg-[#16A34A] text-white"
                      : "border border-slate-200 bg-white text-[#64748B] hover:bg-slate-50"
                  }`}
                >
                  {pIdx}
                </button>
              );
            })}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#64748B] hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 focus:outline-none"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
