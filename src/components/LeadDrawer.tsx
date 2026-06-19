/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, Copy, Check, ExternalLink, Phone, Mail, Globe, 
  MapPin, Calendar, Plus, Trash2, Shield, Heart, Share2, 
  Linkedin, Twitter, Facebook, Instagram, MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Lead, CRMNote } from "../types";

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onAddNote: (leadId: string, noteContent: string) => void;
  onDeleteNote: (leadId: string, noteId: string) => void;
}

export default function LeadDrawer({ lead, onClose, onAddNote, onDeleteNote }: LeadDrawerProps) {
  const [newNote, setNewNote] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!lead) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
        />

        {/* Sliding Panel */}
        <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
            id="lead-drawer"
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50 p-5 flex items-center justify-between">
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  lead.status === 'Prospect' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                  lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  lead.status === 'Meeting Scheduled' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                  lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                  'bg-slate-50 text-slate-700 border border-slate-200'
                }`}>
                  {lead.status}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-1 line-clamp-1">{lead.businessName}</h3>
              </div>
              <button 
                onClick={onClose}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Drawer Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Business Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Summary</h4>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A] block mb-1">
                    {lead.category}
                  </span>
                  <p className="text-sm leading-relaxed text-[#64748B]">{lead.description}</p>
                  
                  {/* Rating Stars indicators */}
                  <div className="mt-3.5 flex items-center gap-1.5 border-t border-slate-200/50 pt-2.5">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className="text-[15px]">
                          {idx < Math.floor(lead.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] font-mono">{lead.rating}</span>
                    <span className="text-xs text-slate-400 font-mono">({lead.reviews} local reviews)</span>
                  </div>
                </div>
              </div>

              {/* CRM Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Channels</h4>
                
                <div className="space-y-2">
                  {/* Phone */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                        <Phone className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Phone Line</span>
                        <span className="text-sm font-semibold text-[#0F172A] font-mono mt-0.5 block">{lead.phone}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.phone, "phone")}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-[#16A34A] hover:bg-slate-100"
                      title="Copy phone"
                    >
                      {copiedField === "phone" ? <Check className="h-4 w-4 text-[#16A34A]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                        <Mail className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 max-w-[240px]">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Primary Email</span>
                        <span className="text-sm font-semibold text-[#0F172A] truncate font-mono mt-0.5 block" title={lead.email}>{lead.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.email, "email")}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-[#16A34A] hover:bg-slate-100"
                      title="Copy email"
                    >
                      {copiedField === "email" ? <Check className="h-4 w-4 text-[#16A34A]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Web */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-emerald-50 text-[#16A34A]">
                        <Globe className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 max-w-[240px]">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Website Domain</span>
                        <a 
                          href={lead.website} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          className="text-sm font-semibold text-[#16A34A] hover:underline flex items-center gap-1.5 mt-0.5 block truncate"
                        >
                          {lead.website.replace("https://", "")} <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(lead.website, "website")}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-[#16A34A] hover:bg-slate-100"
                      title="Copy URL"
                    >
                      {copiedField === "website" ? <Check className="h-4 w-4 text-[#16A34A]" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Social profiles branded section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social B2B Footprint</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <a 
                    href={lead.socials.linkedin || "https://linkedin.com"} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-semibold text-[#64748B] hover:bg-slate-100 hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin className="h-4.5 w-4.5 text-[#0A66C2]" /> Linkedin
                  </a>
                  <a 
                    href={lead.socials.twitter || "https://twitter.com"} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-semibold text-[#64748B] hover:bg-slate-100 hover:text-[#1DA1F2] transition-colors"
                  >
                    <Twitter className="h-4.5 w-4.5 text-[#1DA1F2]" /> X / Twitter
                  </a>
                  <a 
                    href={lead.socials.facebook || "https://facebook.com"} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-semibold text-[#64748B] hover:bg-slate-100 hover:text-[#1877F2] transition-colors"
                  >
                    <Facebook className="h-4.5 w-4.5 text-[#1877F2]" /> Facebook
                  </a>
                  <a 
                    href={lead.socials.instagram || "https://instagram.com"} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs font-semibold text-[#64748B] hover:bg-slate-100 hover:text-[#E1306C] transition-colors"
                  >
                    <Instagram className="h-4.5 w-4.5 text-[#E1306C]" /> Instagram
                  </a>
                </div>
              </div>

              {/* Location with beautiful custom SVG Map Blueprint */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Physical Coordinates</h4>
                
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-[#64748B] leading-normal">
                      {lead.address}
                    </span>
                  </div>

                  {/* SVG Map blueprint */}
                  <div className="relative h-28 w-full rounded-lg bg-slate-200 border border-slate-300/40 overflow-hidden flex items-center justify-center">
                    {/* SVG Radar Map Backdrop grid */}
                    <svg viewBox="0 0 400 120" className="h-full w-full opacity-60">
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      {/* Radiating radar rings */}
                      <circle cx="200" cy="60" r="15" fill="#16A34A" fillOpacity="0.1" />
                      <circle cx="200" cy="60" r="30" fill="none" stroke="#16A34A" strokeWidth="0.75" strokeDasharray="3,3" />
                      <circle cx="200" cy="60" r="45" fill="none" stroke="#16A34A" strokeWidth="0.5" strokeDasharray="8,4" />
                    </svg>

                    <div className="absolute flex flex-col items-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30 animate-bounce">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="bg-[#0F172A] text-white text-[9px] font-mono leading-none rounded px-1.5 py-0.5 mt-1 border border-slate-700 font-bold block whitespace-nowrap">
                        PIN EXTRACTED
                      </span>
                    </div>

                    <span className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400 font-bold uppercase">
                      Local map placeholder
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Timeline Area */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> B2B Touchpoint Timeline
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 text-[#64748B] rounded-full">
                    {lead.notes.length} notes
                  </span>
                </div>

                {/* Insertion Form */}
                <form onSubmit={handleNoteSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log prospect interaction notes..."
                    className="flex-1 rounded-xl border border-[#E2E8F0] bg-slate-50 px-3.5 py-2 text-xs font-medium text-[#0F172A] placeholder:text-slate-400 focus:border-[#16A34A] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#16A34A] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#15803d]"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </form>

                {/* Horizontal Timeline Notes List */}
                <div className="space-y-2.5">
                  {lead.notes.length > 0 ? (
                    lead.notes.map((note) => (
                      <div 
                        key={note.id} 
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 flex justify-between items-start gap-3 group relative transition-all hover:bg-slate-50"
                      >
                        <div className="space-y-1">
                          <p className="text-xs leading-normal font-medium text-[#0F172A]">
                            {note.content}
                          </p>
                          <span className="text-[9px] font-mono font-medium text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(note.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteNote(lead.id, note.id)}
                          className="rounded p-1 text-slate-300 hover:text-red-500 hover:bg-red-50/60 flex-shrink-0"
                          title="Delete note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center rounded-xl border border-dashed border-slate-200 p-4 text-xs font-semibold text-slate-400">
                      No customer engagement notes logged yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sticky Actions Drawer Footer */}
            <div className="border-t border-slate-100 bg-slate-50 p-5 flex gap-3">
              <a
                href={`mailto:${lead.email}?subject=Personalized%20Reachout%20via%20LeadFinder`}
                className="flex-1 rounded-xl bg-[#16A34A] text-white py-2.5 px-3.5 text-xs font-bold text-center hover:bg-[#15803d] shadow-sm tracking-wide shadow-[#16A34A]/20"
              >
                Send Email Outreach
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] py-2.5 px-4 text-xs font-bold text-center hover:bg-slate-50"
              >
                Call Phone Line
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
