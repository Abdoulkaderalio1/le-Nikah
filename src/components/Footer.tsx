import React from 'react';
import { HeartHandshake, Shield, PhoneCall, Lock } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (view: 'home' | 'howItWorks' | 'charter' | 'gmail' | 'admin') => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRegister }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-200 flex items-center justify-center font-serif text-base font-bold">
                ن
              </div>
              <span className="font-serif text-lg font-bold text-amber-50">
                Chemin pour le Nikah
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Plateforme islamique sérieuse pour le mariage au Niger. Profils vérifiés, respect absolu de la vie privée, paiements MyNita et AmanaTa, et validation administrative rigoureuse.
            </p>

            <div className="pt-1 flex items-center gap-2 text-amber-300 font-medium text-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Business Officiel : {OFFICIAL_WHATSAPP_NUMBER}</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider">
              Navigation
            </div>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Profils validés
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('howItWorks')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Comment ça marche
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('charter')}
                  className="hover:text-amber-200 transition-colors"
                >
                  Charte & Sunnah
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-amber-200 transition-colors text-amber-400"
                >
                  Déposer un profil
                </button>
              </li>
            </ul>
          </div>

          {/* Niger local payment & Admin */}
          <div className="md:col-span-4 space-y-2">
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider">
              Médiation & Paiements Locaux
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Règlements des frais de mise en contact acceptés par transferts locaux <strong className="text-stone-200">MyNita</strong> et <strong className="text-stone-200">AmanaTa</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors bg-stone-800/80 hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700/60"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Accès Espace Administrateur</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Chemin pour le Nikah · République du Niger · Tous droits réservés.
          </div>
          <div className="font-serif italic text-stone-400">
            « Qu'Allah unisse les cœurs purs dans le bien et la piété. »
          </div>
        </div>
      </div>
    </footer>
  );
};
