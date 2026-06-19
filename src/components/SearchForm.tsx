/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, Layers, Users, Sparkles, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SearchQuery } from "../types";

interface SearchFormProps {
  onSearch: (query: SearchQuery) => void;
  isLoading: boolean;
}

const PRESET_CITIES = [
  "New York",
  "San Francisco",
  "London",
  "Austin",
  "Los Angeles",
  "Chicago",
  "Miami",
  "Seattle",
  "Boston",
  "Toronto"
];

const PRESET_NICHES = [
  "Tech Startups",
  "Marketing Agencies",
  "Dental Clinics",
  "Real Estate Agency",
  "Coffee Shops & Cafes",
  "Law Firms",
  "Boutique Hotels",
  "Fitness Gyms",
  "Digital Consultants",
  "Coworking Spaces"
];

const PRESET_COUNTS = [10, 20, 30, 50];

const RECOMMENDED_PAIRS = [
  { city: "San Francisco", niche: "Tech Startups", label: "Startups in SF" },
  { city: "New York", niche: "Marketing Agencies", label: "NY Agencies" },
  { city: "London", niche: "Boutique Hotels", label: "London Hotels" },
  { city: "Miami", niche: "Coffee Shops & Cafes", label: "Miami Cafes" }
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [cityInput, setCityInput] = useState("");
  const [nicheInput, setNicheInput] = useState("");
  const [selectedCount, setSelectedCount] = useState<number>(15);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  const [showCountDropdown, setShowCountDropdown] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const nicheRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (nicheRef.current && !nicheRef.current.contains(event.target as Node)) {
        setShowNicheDropdown(false);
      }
      if (countRef.current && !countRef.current.contains(event.target as Node)) {
        setShowCountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = PRESET_CITIES.filter(city => 
    city.toLowerCase().includes(cityInput.toLowerCase())
  );

  const filteredNiches = PRESET_NICHES.filter(niche => 
    niche.toLowerCase().includes(nicheInput.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim() || !nicheInput.trim()) return;
    onSearch({
      city: cityInput.trim(),
      niche: nicheInput.trim(),
      count: selectedCount
    });
  };

  const handleRecommendationClick = (city: string, niche: string) => {
    setCityInput(city);
    setNicheInput(niche);
    onSearch({ city, niche, count: selectedCount });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm shadow-[#0F172A]/5 md:p-8"
      >
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
          <Sparkles className="h-3.5 w-3.5" /> AI Prospecting Engine
        </span>

        <h2 className="font-sans text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
          Search Filters
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Fill out the criteria below to query our local directories or activate Gemini AI search models.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* City Field */}
            <div ref={cityRef} className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                Target City
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                  <MapPin className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  id="search-city-input"
                  value={cityInput}
                  onChange={(e) => {
                    setCityInput(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder="Enter city name (e.g. Austin)"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-[#0F172A] transition-colors placeholder:text-[#64748B]/60 hover:bg-[#F8FAFC] focus:border-[#16A34A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
                  autoComplete="off"
                />
              </div>

              {/* City Autocomplete Dropdown */}
              <AnimatePresence>
                {showCityDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-30 mt-2 max-h-52 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg shadow-[#0F172A]/5"
                  >
                    <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B]/70">
                      Popular Locations
                    </div>
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setCityInput(city);
                            setShowCityDropdown(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-[#0F172A] hover:bg-slate-50"
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#64748B]/70" /> {city}
                          </span>
                          {cityInput === city && <Check className="h-4 w-4 text-[#16A34A]" />}
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCityDropdown(false)}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-[#64748B]/80 hover:bg-slate-50"
                      >
                        Use Custom: {cityInput}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Niche Field */}
            <div ref={nicheRef} className="relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                Business Niche
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                  <Layers className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  id="search-niche-input"
                  value={nicheInput}
                  onChange={(e) => {
                    setNicheInput(e.target.value);
                    setShowNicheDropdown(true);
                  }}
                  onFocus={() => setShowNicheDropdown(true)}
                  placeholder="Choose business category (e.g. Dental)"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-[#0F172A] transition-colors placeholder:text-[#64748B]/60 hover:bg-[#F8FAFC] focus:border-[#16A34A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
                  autoComplete="off"
                />
              </div>

              {/* Niche Autocomplete Dropdown */}
              <AnimatePresence>
                {showNicheDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 z-30 mt-2 max-h-52 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg shadow-[#0F172A]/5"
                  >
                    <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B]/70">
                      Standard B2B Verticals
                    </div>
                    {filteredNiches.length > 0 ? (
                      filteredNiches.map((niche) => (
                        <button
                          key={niche}
                          type="button"
                          onClick={() => {
                            setNicheInput(niche);
                            setShowNicheDropdown(false);
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-[#0F172A] hover:bg-slate-50"
                        >
                          <span className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[#64748B]/70" /> {niche}
                          </span>
                          {nicheInput === niche && <Check className="h-4 w-4 text-[#16A34A]" />}
                        </button>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowNicheDropdown(false)}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-[#64748B]/80 hover:bg-slate-50"
                      >
                        Use Custom: {nicheInput}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Lead Quantity Field */}
          <div ref={countRef} className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Prospect Quantity
            </label>
            <button
              type="button"
              id="search-count-dropdown"
              onClick={() => setShowCountDropdown(!showCountDropdown)}
              className="flex w-full items-center justify-between rounded-xl border border-[#E2E8F0] bg-slate-50 px-4 py-3 text-sm font-medium text-[#0F172A] transition-all hover:bg-[#F8FAFC] focus:border-[#16A34A] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
            >
              <span className="flex items-center gap-2.5 text-[#0F172A]">
                <Users className="h-5 w-5 text-[#64748B]" />
                Generate {selectedCount} targeted prospects
              </span>
              <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${showCountDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown elements */}
            <AnimatePresence>
              {showCountDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 z-30 mt-2 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg shadow-[#0F172A]/5"
                >
                  {PRESET_COUNTS.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        setSelectedCount(cnt);
                        setShowCountDropdown(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-slate-50"
                    >
                      <span>Retrieve {cnt} listings</span>
                      {selectedCount === cnt && <Check className="h-4 w-4 text-[#16A34A]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Find Leads button */}
          <button
            type="submit"
            id="search-submit-btn"
            disabled={isLoading || !cityInput.trim() || !nicheInput.trim()}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#16A34A] py-3.5 px-4 font-sans text-sm font-semibold text-white shadow-md shadow-[#16A34A]/25 transition-all duration-300 hover:bg-[#15803d] hover:shadow-lg hover:shadow-[#16A34A]/35 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <Search className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
            <span>Find Leads</span>
          </button>
        </form>

        {/* Hot pre-cooked templates */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
            One-touch Demo Queries
          </span>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {RECOMMENDED_PAIRS.map((pair) => (
              <button
                key={pair.label}
                type="button"
                onClick={() => handleRecommendationClick(pair.city, pair.niche)}
                className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] transition-all hover:border-[#16A34A] hover:bg-emerald-50/40"
              >
                <Sparkles className="h-3 w-3 text-[#16A34A]" />
                {pair.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
