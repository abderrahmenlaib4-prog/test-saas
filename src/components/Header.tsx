import React from "react";
import { Search, Bell, ChevronsRight } from "lucide-react";

interface HeaderProps {
  title?: string;
  userName?: string;
}

export default function Header({ 
  title = "Dashboard", 
  userName = "User"
}: HeaderProps) {
  const displayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[#F8FAFC]">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">{title}</h1>
        {title === 'Dashboard' && (
          <>
            <ChevronsRight className="h-4 w-4 text-[#64748B] mt-1" />
            <span className="text-sm font-semibold text-[#64748B] mt-1">Hello, {userName.split(" ")[0]}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#0F172A] hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#F8FAFC]"></span>
        </button>

        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#64748B]" />
          </div>
          <input
            type="text"
            placeholder="Search leads, cities..."
            className="w-64 pl-10 pr-4 py-2 rounded-full border border-[#E2E8F0] bg-white text-sm font-semibold text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#16A34A] focus:border-[#16A34A] shadow-sm shadow-slate-100/50 transition-all focus:w-72"
          />
        </div>
      </div>
    </header>
  );
}
