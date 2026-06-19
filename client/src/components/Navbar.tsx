import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import api from "@/configs/axios";
import { Search, Coins } from "lucide-react";

const NAV_LINKS = [
  { to: "/models", label: "Models" },
  { to: "/workflows", label: "Workflows" },
  { to: "/deployments", label: "Deployments" },
  { to: "/monitoring", label: "Monitoring" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [credits, setCredits] = useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { data: session } = authClient.useSession();

  const getCredits = async () => {
    try {
      const { data } = await api.get("/api/user/credits");
      setCredits(data.credits);
    } catch {}
  };

  useEffect(() => {
    if (session?.user) getCredits();
  }, [session?.user]);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="w-full flex items-center justify-between px-6 md:px-10 h-full max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#E040A0]">
              FORGE
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 ml-8">
            {NAV_LINKS.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative text-sm font-medium transition-colors pb-1 ${
                    active ? "text-[#E040A0]" : "text-slate-600 hover:text-[#E040A0]"
                  }`}
                >
                  {label}
                  {/* Active underline with smooth transition */}
                  <span
                    className="absolute bottom-0 left-0 h-0.5 bg-[#E040A0] rounded-full transition-all duration-300"
                    style={{ width: active ? "100%" : "0%" }}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-[#E040A0]/30 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {!session?.user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  to="/auth/signin"
                  className="text-sm font-medium text-slate-600 hover:text-[#E040A0] transition-colors"
                >
                  Sign in
                </Link>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="px-5 py-2 text-sm font-medium text-white bg-[#E040A0] hover:bg-[#c9328d] transition-colors rounded-full shadow-[0_4px_14px_0_rgba(224,64,160,0.39)] hover:shadow-[0_6px_20px_rgba(224,64,160,0.23)]"
                >
                  Initiate Protocol
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-xs font-bold text-[#E040A0] shadow-[0_2px_8px_rgba(224,64,160,0.05)]">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{credits} Credits</span>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="hidden md:block px-5 py-2 text-sm font-medium text-white bg-[#E040A0] hover:bg-[#c9328d] transition-colors rounded-full shadow-[0_4px_14px_0_rgba(224,64,160,0.39)] hover:shadow-[0_6px_20px_rgba(224,64,160,0.23)]"
                >
                  Initiate Protocol
                </button>
                <UserButton />
              </div>
            )}

            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setMenuOpen(v => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12"/>
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-16 bg-white border-b border-slate-200">
          <div className="flex flex-col p-4">
            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-3 mb-4">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-transparent border-none outline-none text-base w-full text-slate-700"
              />
            </div>
            
            {session?.user && (
              <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-pink-50 rounded-xl border border-pink-100">
                <Coins className="w-4 h-4 text-[#E040A0]" />
                <span className="text-sm font-bold text-[#E040A0]">{credits} Credits remaining</span>
              </div>
            )}

            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-4 text-base font-medium border-b border-slate-100 transition-colors ${
                  isActive(to) ? "text-[#E040A0]" : "text-slate-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

    </>
  );
};

export default Navbar;
