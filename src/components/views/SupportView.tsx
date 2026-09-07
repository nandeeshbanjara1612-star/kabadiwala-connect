import React from 'react';
import {
  LifeBuoy,
  PhoneCall,
  Mail,
  HelpCircle,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const rates = [
    { category: 'Paper (Newspaper/Magazines)', rate: '₹14 / kg' },
    { category: 'Cardboard & Corrugated Boxes', rate: '₹11 / kg' },
    { category: 'Plastic (PET Bottles, HDPE)', rate: '₹16 / kg' },
    { category: 'Metals (Iron, Steel, Copper)', rate: '₹28 - ₹350 / kg' },
    { category: 'E-Waste (Motherboards, Gadgets)', rate: '₹35 - ₹120 / kg' },
    { category: 'Glass Bottles', rate: '₹4 / kg' },
  ];

  return (
    <div id="support-view" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-emerald-600" />
            <span>Collector Helpdesk & Support</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            24/7 on-field assistance, scrap pricing tables, and safety guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:18001234567"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Toll-Free Helpline</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scrap Rates Guide */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Standard Cluster Scrap Pricing Table</span>
          </h3>

          <div className="space-y-2">
            {rates.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-medium text-slate-800">{r.category}</span>
                <span className="font-bold text-emerald-700">{r.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Protocol */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Collector Safety Protocol</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Always wear certified puncture-resistant gloves and safety footwear.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Use a calibrated digital hanging scale for transparent customer weighing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Keep hazardous materials and lithium-ion batteries separated in fire-safe bins.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Ensure instant digital receipt generation via QR code at point of pickup.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
