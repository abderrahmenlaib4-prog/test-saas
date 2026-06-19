/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BarChart3, PieChart, CheckCircle2, Star, TrendingUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Lead } from "../types";

interface AnalyticsDashboardProps {
  leads: Lead[];
}

export default function AnalyticsDashboard({ leads }: AnalyticsDashboardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<{ chart: string; index: number | null }>({
    chart: "",
    index: null
  });

  if (leads.length === 0) return null;

  // 1. Leads by City Calculations
  const cityMap: Record<string, number> = {};
  leads.forEach(lead => {
    cityMap[lead.city] = (cityMap[lead.city] || 0) + 1;
  });
  const cityData = Object.entries(cityMap).map(([city, count]) => ({ city, count }));
  const maxCityCount = Math.max(...cityData.map(d => d.count), 1);

  // 2. Leads by Category Calculations
  const categoryMap: Record<string, number> = {};
  leads.forEach(lead => {
    categoryMap[lead.category] = (categoryMap[lead.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
  const totalCategoryLeads = leads.length;

  // 3. Contact Availability Calculations
  let hasBoth = 0;
  let hasEmail = 0;
  let hasPhone = 0;
  let hasNone = 0;

  leads.forEach(lead => {
    const hasE = !!lead.email && lead.email.includes("@");
    const hasP = !!lead.phone && lead.phone.length > 5;
    if (hasE && hasP) hasBoth++;
    else if (hasE) hasEmail++;
    else if (hasP) hasPhone++;
    else hasNone++;
  });

  const contactData = [
    { name: "Email + Phone", count: hasBoth, color: "#16A34A" }, // Emerald Green
    { name: "Email Only", count: hasEmail, color: "#10B981" },  // Light Green
    { name: "Phone Only", count: hasPhone, color: "#64748B" },  // Slate Grey
    { name: "Website Only", count: hasNone, color: "#E2E8F0" }  // Ash
  ].filter(item => item.count > 0);
  const totalContacts = leads.length;

  // 4. Rating Distribution
  let stars45 = 0; // 4.5 to 5.0
  let stars40 = 0; // 4.0 to 4.4
  let stars35 = 0; // 3.5 to 3.9
  let starsBelow = 0; // Below 3.5

  leads.forEach(lead => {
    if (lead.rating >= 4.5) stars45++;
    else if (lead.rating >= 4.0) stars40++;
    else if (lead.rating >= 3.5) stars35++;
    else starsBelow++;
  });

  const ratingData = [
    { label: "Elite (4.5 - 5.0 ★)", count: stars45, color: "#16A34A" },
    { label: "Good (4.0 - 4.4 ★)", count: stars40, color: "#10B981" },
    { label: "Average (3.5 - 3.9 ★)", count: stars35, color: "#94A3B8" },
    { label: "Budget (Below 3.5 ★)", count: starsBelow, color: "#CBD5E1" }
  ];
  const maxRatingCount = Math.max(...ratingData.map(d => d.count), 1);

  // Helper circle calculation for Donut Chart
  let accumulatedAngle = 0;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      
      {/* Chart 1: Leads by City (Bar Chart) */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm shadow-[#0F172A]/3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#16A34A]" />
            <h3 className="font-sans text-[15px] font-bold tracking-tight text-[#0F172A]">
              Leads by Target City
            </h3>
          </div>
          <span className="text-[11px] font-mono font-medium rounded BG-slate-50 border border-slate-100 px-2 py-0.5 text-slate-500">
            Regional Index
          </span>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="relative flex h-56 flex-col justify-end pt-4">
          <div className="flex h-full items-end gap-3 px-2">
            {cityData.map((data, idx) => {
              const pct = (data.count / maxCityCount) * 80; // Scale height max out at 80% to fit labels
              const isHovered = hoveredIndex.chart === "city" && hoveredIndex.index === idx;

              return (
                <div 
                  key={data.city} 
                  className="flex flex-1 flex-col items-center group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex({ chart: "city", index: idx })}
                  onMouseLeave={() => setHoveredIndex({ chart: "", index: null })}
                >
                  {/* Interactive tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute bottom-full z-15 mb-2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-center text-[11px] font-medium text-white shadow-md shadow-[#0F172A]/20"
                      >
                        <span className="block font-semibold">{data.city}</span>
                        <span className="font-mono text-emerald-400">{data.count} Leads ({Math.round(data.count/leads.length*100)}%)</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Visual Bar */}
                  <div className="w-full relative rounded-t-lg overflow-hidden bg-slate-100 h-40 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`w-full rounded-t-lg transition-colors ${isHovered ? 'bg-[#15803d]' : 'bg-[#16A34A]'}`}
                    />
                  </div>
                  
                  {/* Axis Label */}
                  <span className="mt-2.5 block text-center text-[11px] font-semibold text-[#64748B] max-w-full truncate">
                    {data.city}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Base border axis */}
          <div className="mt-1 h-[1px] w-full bg-slate-200" />
        </div>
      </div>

      {/* Chart 2: Contact Availability (Donut Chart) */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm shadow-[#0F172A]/3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#16A34A]" />
            <h3 className="font-sans text-[15px] font-bold tracking-tight text-[#0F172A]">
              Contact Channels Depth
            </h3>
          </div>
          <span className="text-[11px] font-mono font-medium rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[#16A34A]">
            Outreach Channels
          </span>
        </div>

        <div className="flex h-56 items-center justify-around">
          {/* Scaled SVG Donut circular slice */}
          <div className="relative h-40 w-40 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              {contactData.map((data, idx) => {
                const anglePercent = data.count / totalContacts;
                const dashArray = `${anglePercent * 282.6} 282.6`; // 2 * pi * r (with r=45 is 282.6)
                const dashOffset = `-${accumulatedAngle * 282.6}`;
                accumulatedAngle += anglePercent;

                const isHovered = hoveredIndex.chart === "contact" && hoveredIndex.index === idx;

                return (
                  <circle
                    key={data.name}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={data.color}
                    strokeWidth={isHovered ? "16" : "12"}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex({ chart: "contact", index: idx })}
                    onMouseLeave={() => setHoveredIndex({ chart: "", index: null })}
                  />
                );
              })}
            </svg>

            {/* Inner text metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono leading-none">
                {Math.round((hasBoth + hasEmail + hasPhone) / leads.length * 100)}%
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] mt-0.5 uppercase tracking-wider scale-95">
                Reachability
              </span>
            </div>
          </div>

          {/* Custom Side-labels Legend */}
          <div className="flex flex-col gap-2.5">
            {contactData.map((data, idx) => {
              const isHovered = hoveredIndex.chart === "contact" && hoveredIndex.index === idx;
              return (
                <div 
                  key={data.name} 
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${isHovered ? 'bg-slate-50' : ''}`}
                  onMouseEnter={() => setHoveredIndex({ chart: "contact", index: idx })}
                  onMouseLeave={() => setHoveredIndex({ chart: "", index: null })}
                >
                  <span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                  <div>
                    <span className="block text-xs font-semibold text-[#0F172A] leading-tight">{data.name}</span>
                    <span className="block text-[10px] text-[#64748B] font-mono">
                      {data.count} ({Math.round(data.count/totalContacts*100)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart 3: Rating Distribution (Horizontal Bars) */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm shadow-[#0F172A]/3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="font-sans text-[15px] font-bold tracking-tight text-[#0F172A]">
              Rating Tier Distribution
            </h3>
          </div>
          <span className="text-[11px] font-mono font-medium rounded bg-amber-50 border border-amber-100 px-2 py-0.5 text-amber-600">
            Reviews Quality
          </span>
        </div>

        <div className="flex h-56 flex-col justify-center space-y-4 px-1">
          {ratingData.map((data, idx) => {
            const pct = (data.count / maxRatingCount) * 100;
            const isHovered = hoveredIndex.chart === "rating" && hoveredIndex.index === idx;

            return (
              <div 
                key={data.label}
                className="space-y-1 group cursor-pointer"
                onMouseEnter={() => setHoveredIndex({ chart: "rating", index: idx })}
                onMouseLeave={() => setHoveredIndex({ chart: "", index: null })}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className={`transition-colors ${isHovered ? 'text-[#16A34A]' : 'text-[#0F172A]'}`}>{data.label}</span>
                  <span className="text-[#64748B] font-mono">{data.count} leads</span>
                </div>
                {/* Horizontal slider bar */}
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full rounded-full transition-colors"
                    style={{ backgroundColor: isHovered ? '#16A34A' : data.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 4: Lead Status Categorization */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm shadow-[#0F172A]/3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />
            <h3 className="font-sans text-[15px] font-bold tracking-tight text-[#0F172A]">
              CRM Distribution Share
            </h3>
          </div>
          <span className="text-[11px] font-mono font-medium rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-blue-600">
            Lifecycle Stream
          </span>
        </div>

        {/* Dynamic Horizontal stacked flow chart */}
        <div className="flex h-56 flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0F172A]">Lead Life Stage Breakdown</span>
              <span className="font-mono text-[#64748B] font-bold">{leads.length} Active Targets</span>
            </div>
            
            {/* Horizontal Segment Stack bar */}
            <div className="h-5 w-full flex rounded-full overflow-hidden bg-slate-100 shadow-inner">
              {categoryData.slice(0, 4).map((data, idx) => {
                const widthPct = (data.count / totalCategoryLeads) * 100;
                // Distribute diverse startup colors
                const colors = ["#16A34A", "#10B981", "#334155", "#64748B"];
                const col = colors[idx % colors.length];

                return (
                  <motion.div
                    key={data.category}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full cursor-pointer relative group flex items-center justify-center text-[10px] font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: col }}
                    title={`${data.category}: ${data.count} leads`}
                  >
                    {widthPct > 12 && <span className="truncate px-1 font-mono">{Math.round(widthPct)}%</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Stat Insights Block */}
          <div className="rounded-xl bg-slate-50 p-3 flex gap-2.5 items-start border border-slate-100">
            <Info className="h-4.5 w-4.5 text-[#16A34A] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed text-[#64748B]">
              <strong className="text-[#0F172A]">CRM Smart Insight:</strong> {categoryData.length > 0 ? `${categoryData[0].category} represents the largest volume bracket (${Math.round((categoryData[0].count/leads.length)*100)}% of total leads fetched).` : 'Ready to analyze active listing clusters.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
