import React from 'react';
import { Shield, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface HeroProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
  totalVerifiedProfiles: number;
}

export const Hero: React.FC<HeroProps> = ({
  onRegisterClick,
  onExploreClick,
  totalVerifiedProfiles,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-[#faf8f5] to-[#faf8f5] border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200/60 rounded-full w-fit px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Plateforme matrimoniale de référence au Niger</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] text-balance">
              Le chemin sérieux et béni vers le mariage islamique.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Au Niger, fonder un foyer est un acte noble et sacré. Nous facilitons la mise en
              relation des célibataires, divorcé(e)s et veufs/veuves selon les préceptes de la
              Sunnah, avec modération rigoureuse des profils, discrétion absolue et paiement
              sécurisé via <strong className="text-stone-900 font-semibold">MyNita</strong> et{' '}
              <strong className="text-stone-900 font-semibold">AmanaTa</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onRegisterClick}
                className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Inscrire mon profil gratuitement
              </button>
              <button
                onClick={onExploreClick}
                className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-5 py-3 rounded-lg text-sm font-medium transition-all"
              >
                Explorer les profils vérifiés ({totalVerifiedProfiles})
              </button>
            </div>

            {/* Trust Markers without pill boxes */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-800" />
                <span>Validation préalable par l’administrateur</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                <span>Coordonnées jamais publiées</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-800" />
                <span>WhatsApp Business officiel : {OFFICIAL_WHATSAPP_NUMBER}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-amber-900/15 shadow-xl bg-stone-900 aspect-[4/3]">
              <img
                src="/src/assets/images/hero_nikah_niger_1793004992113.jpg"
                alt="Architecture traditionnelle au Niger représentant la tradition du mariage"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <p className="font-serif italic text-sm sm:text-base text-amber-200 leading-snug">
                  « Et parmi Ses signes Il a créé de vous, pour vous, des épouses afin que vous viviez en tranquillité avec elles... »
                </p>
                <p className="text-xs text-stone-300 mt-2 font-medium">
                  Sourate Ar-Rum (Les Romains), verset 21
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
