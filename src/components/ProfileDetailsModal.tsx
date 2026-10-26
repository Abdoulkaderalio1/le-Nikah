import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Briefcase, GraduationCap, BookOpen, Heart, HeartHandshake, Lock, Phone } from 'lucide-react';
import { Profile } from '../types/nikah';

interface ProfileDetailsModalProps {
  profile: Profile | null;
  onClose: () => void;
  onRequestContact: (profile: Profile) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onRequestContact,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-medium text-emerald-950 bg-emerald-100/70 px-2.5 py-1 rounded">
              Réf : {profile.codeId}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Profil vérifié par l'administration</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Grid: Photos & Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Photos Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={profile.photos[selectedPhotoIndex] || profile.photos[0]}
                  alt={`Photo ${selectedPhotoIndex + 1} de ${profile.prenomPseudo}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Photos Switcher (2 photos obligatoires) */}
              <div className="grid grid-cols-2 gap-2">
                {profile.photos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPhotoIndex === idx
                        ? 'border-emerald-800 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Miniature ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Photo {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Overview Column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {profile.prenomPseudo},{' '}
                  <span className="tabular-nums font-sans font-normal text-stone-600">
                    {profile.age} ans
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-stone-600 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span>Ville : {profile.ville} (Niger)</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span>{profile.sexe === 'FEMME' ? 'Femme' : 'Homme'}</span>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/50">
                  <span className="text-stone-500">Situation matrimoniale :</span>
                  <span className="font-semibold text-stone-900">{profile.situationMatrimoniale}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/50">
                  <span className="text-stone-500">Profession :</span>
                  <span className="font-semibold text-stone-900">{profile.profession}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/50">
                  <span className="text-stone-500">Niveau d'études :</span>
                  <span className="font-semibold text-stone-900">{profile.niveauEtudes}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Critère recherché :</span>
                  <span className="font-semibold text-emerald-900">
                    {profile.rechercheSexe === 'FEMME' ? 'Femme' : 'Homme'} de {profile.rechercheAgeMin} à {profile.rechercheAgeMax} ans
                  </span>
                </div>
              </div>

              {/* Confidentiality notice */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 flex items-start gap-3 text-xs text-amber-900">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Coordonnées personnelles protégées :</strong>
                  <p className="text-amber-800 mt-0.5">
                    Le numéro de téléphone, WhatsApp et les contacts du tuteur légal sont délivrés uniquement après paiement des frais de mise en contact et validation administrative.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Religious details */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                Présentation personnelle
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                {profile.presentation}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
                <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  Pratique religieuse & Sunnah
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {profile.pratiqueReligieuse}
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1.5">
                <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-800" />
                  Vision du foyer & Projet de famille
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {profile.projetFamille}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-stone-500">
            Médiation par l'administration · MyNita & AmanaTa
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestContact(profile);
              }}
              className="flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              <span>Demander la mise en contact (Nikah)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
