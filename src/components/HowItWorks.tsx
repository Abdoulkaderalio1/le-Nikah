import React from 'react';
import { ShieldCheck, UserCheck, CreditCard, Send, Lock, HeartHandshake } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface HowItWorksProps {
  onRegisterClick: () => void;
  onExploreClick: () => void;
  contactFeeFcfa: number;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onRegisterClick,
  onExploreClick,
  contactFeeFcfa,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Fonctionnement de « Chemin pour le Nikah »
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Un protocole sérieux, pudique et structuré conçu pour préserver la dignité des familles au Niger et faciliter les mariages licites.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-200 flex items-center justify-center font-serif text-lg font-bold">
            1
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Inscription & 2 photos obligatoires
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Vous remplissez votre profil : prénom ou pseudo, âge, ville au Niger (Niamey, Maradi, Zinder...), situation matrimoniale, profession, présentation et vos critères. Deux photos décentes sont obligatoires pour garantir l’authenticité.
          </p>
          <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>Protection stricte :</strong> Vos numéros de téléphone et WhatsApp ne sont jamais affichés publiquement sur le site.
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-200 flex items-center justify-center font-serif text-lg font-bold">
            2
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Validation préalable par l’administrateur
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Le profil reste en statut <em>« En attente »</em>. L’administrateur vérifie personnellement la décence des photos, l’adéquation de l’annonce et supprime immédiatement tout profil douteux, libertin ou suspect.
          </p>
          <div className="text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <strong>Garantie de sérénité :</strong> Seuls les profils validés et sérieux sont rendus accessibles à la communauté.
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-200 flex items-center justify-center font-serif text-lg font-bold">
            3
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Mise en contact payante via MyNita ou AmanaTa
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Lorsqu’une personne s’intéresse à un profil, elle s’acquitte des frais de médiation ({contactFeeFcfa.toLocaleString()} FCFA) via les réseaux de transfert du Niger : <strong>MyNita</strong> ou <strong>AmanaTa</strong>.
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            Ces frais symboliques filtrent les personnes non sérieuses et soutiennent le travail de modération et de médiation.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-200 flex items-center justify-center font-serif text-lg font-bold">
            4
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Envoi de preuve WhatsApp & Mise en relation
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Le demandeur envoie sa capture de reçu sur le WhatsApp Business officiel : <span className="font-semibold text-emerald-950 font-mono">{OFFICIAL_WHATSAPP_NUMBER}</span>.
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            Après confirmation de la transaction, l’administrateur contacte les parties ou le tuteur légal (Wali pour les sœurs) pour transmettre les coordonnées et permettre la rencontre licite (Ro’ya char’iyya).
          </p>
        </div>
      </div>

      {/* Action Strip */}
      <div className="bg-stone-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-serif text-xl font-bold text-amber-200">
            Prêt(e) à cheminer vers un mariage béni ?
          </div>
          <p className="text-xs text-stone-300">
            L'inscription est simple et gratuite. Les coordonnées restent confidentielles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRegisterClick}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            Déposer mon profil maintenant
          </button>
          <button
            onClick={onExploreClick}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2.5 rounded-lg text-xs font-medium transition-all"
          >
            Voir les profils validés
          </button>
        </div>
      </div>
    </div>
  );
};
