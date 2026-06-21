import React from "react";
import { 
  Home, Star, Target, Search, Share2, DownloadCloud, 
  Settings, HelpCircle, BarChart2, MoreVertical, LogOut
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const sections = [
    {
      title: "Overview",
      items: [
        { id: "home", label: "Dashboard", icon: Home },
        { id: "favorites", label: "Saved Leads", icon: Star },
        { id: "campaigns", label: "Campaigns", icon: Target },
      ]
    },
    {
      title: "Data & Tools",
      items: [
        { id: "search", label: "Lead Search", icon: Search },
        { id: "integrations", label: "Integrations", icon: Share2 },
        { id: "exports", label: "Export History", icon: DownloadCloud },
      ]
    },
    {
      title: "Setting & Informations",
      items: [
        { id: "settings", label: "Settings & Services", icon: Settings },
        { id: "help", label: "Help & Support", icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="flex items-center justify-center gap-0.5 text-[#16A34A]">
            <div className="w-1.5 h-4 bg-[#16A34A] rounded-full" />
            <div className="w-1.5 h-6 bg-[#16A34A] rounded-full" />
            <div className="w-1.5 h-8 bg-[#16A34A] rounded-full" />
            <div className="w-1.5 h-5 bg-[#16A34A] rounded-full" />
          </div>
          <span className="font-extrabold text-[#0F172A] text-xl tracking-tight">
            LeadFinder
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/20' 
                          : 'text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto border-t border-[#E2E8F0]">
        <div className="w-full flex items-center justify-between px-2 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm shadow-slate-100">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}&backgroundColor=e2e8f0`} 
              alt="User profile" 
              className="w-9 h-9 rounded-full bg-slate-100 object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="text-left w-[110px]">
              <span className="block text-[13px] font-bold text-[#0F172A] truncate" title={user.name}>{user.name}</span>
              <span className="block text-[10px] font-medium text-[#64748B] truncate" title={user.email}>{user.email}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-1 focus:ring-red-200 flex-shrink-0"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
