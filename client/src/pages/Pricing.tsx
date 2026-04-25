import React from "react";
import { appPlans } from "../assets/assets";
import Footer from "../components/Footer";
import { toast } from "sonner";
import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const { data: session } = authClient.useSession();
  const [plans] = React.useState<Plan[]>(appPlans);
  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) return toast("Please login to purchase credits");
      const { data } = await api.post("/api/user/purchase-credits", { planId });
      window.location.href = data.payment_link;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto z-20 max-md:px-4 min-h-[80vh] relative pt-24">
        <div className="text-center mt-20 mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(239, 68, 68, 0.2)',
            }}>
            SUBSCRIPTION MATRIX
          </h1>
          <p className="text-sm max-w-md mx-auto mt-2 tracking-cosmic" style={{ color: 'var(--star-2)' }}>
            Calibrate your operational capacity. Select a resource tier to maintain system dominance.
          </p>
        </div>
        <div className="pt-14 py-4 px-4 ">
          <div className="grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className="p-8 bg-black/40 backdrop-blur-xl border border-[var(--seam)] mx-auto w-full max-w-sm rounded-lg text-white shadow-2xl hover:border-[var(--signal)] transition-all duration-500 hud-corners holo-input group animate-fade-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xs font-mono tracking-widest uppercase opacity-70" style={{ color: 'var(--star-2)' }}>
                    {plan.name}
                  </h3>
                  {idx === 1 && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[var(--signal)] text-[var(--signal)] animate-pulse">
                      RECOMMENDED
                    </span>
                  )}
                </div>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                  <span className="text-xs opacity-50 ml-2 font-mono tracking-tighter">
                    / {plan.credits} CREDITS
                  </span>
                </div>

                <p className="text-xs leading-relaxed mb-8 h-10" style={{ color: 'var(--star-2)' }}>{plan.description}</p>

                <ul className="space-y-3 mb-8 text-xs font-mono">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="size-1.5 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)]" />
                      <span style={{ color: 'var(--star-2)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="w-full py-3 px-4 font-mono tracking-widest text-[10px] uppercase text-white transition-all active:scale-95 hud-corners"
                  style={{
                    background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
                  }}
                >
                  INITIATE_UPGRADE
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto text-center mt-16 p-6 rounded border border-[var(--seam)] bg-black/20 backdrop-blur-sm max-w-2xl animate-fade-up hud-corners"
          style={{ animationDelay: '400ms' }}>
          <p className="text-[10px] font-mono tracking-widest uppercase opacity-60" style={{ color: 'var(--star-2)' }}>
            OPERATIONAL_DATA: Project <span className="text-[var(--signal)]">Creation / Revision</span>{" "}
            requires <span className="text-[var(--signal)]">5 units </span> of operational energy.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
