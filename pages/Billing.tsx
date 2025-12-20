
import React from 'react';
import { Check, Zap, Rocket, Building, ShieldCheck } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for creators just starting with automation.',
    features: ['1 Instagram Account', '500 AI Replies / mo', 'Standard Support', 'Basic Analytics'],
    icon: Zap,
    color: 'slate'
  },
  {
    name: 'Pro',
    price: '$79',
    description: 'Advanced features for growing businesses.',
    features: ['3 Instagram Accounts', '5,000 AI Replies / mo', 'Priority Support', 'Advanced Analytics', 'n8n Webhook Access'],
    icon: Rocket,
    color: 'blue',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$249',
    description: 'Custom solutions for high-volume agencies.',
    features: ['Unlimited Accounts', 'Unlimited AI Replies', 'Dedicated Support', 'Custom Integrations', 'White-label Reports'],
    icon: Building,
    color: 'purple'
  }
];

const Billing: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Plans & Pricing</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Scale your Instagram engagement with powerful AI automation. Choose the plan that fits your growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`glass rounded-3xl p-8 flex flex-col relative transition-all duration-500 hover:scale-105 ${
              plan.popular ? 'border-blue-500/50 glow-purple z-10' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
              plan.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 
              plan.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'
            }`}>
              <plan.icon className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-slate-500">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">{plan.description}</p>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
              plan.popular 
              ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' 
              : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}>
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-8 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-400">Payment Security</h4>
            <p className="text-xs text-slate-400">All transactions are encrypted with 256-bit SSL via Stripe.</p>
          </div>
        </div>
        <div className="flex gap-4 opacity-50 grayscale">
          {/* Logo Placeholders */}
          <div className="h-6 w-12 bg-white/20 rounded"></div>
          <div className="h-6 w-12 bg-white/20 rounded"></div>
          <div className="h-6 w-12 bg-white/20 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
