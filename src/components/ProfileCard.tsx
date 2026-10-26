import React from 'react';
import { MapPin, ShieldCheck, Camera, Sparkles, HeartHandshake } from 'lucide-react';
import { Profile } from '../types/nikah';

interface ProfileCardProps {
  profile: Profile;
  onViewDetails: (profile: Profile) => void;
  onRequestContact: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewDetails,
  onRequestContact,
}) => {
  const primaryPhoto = profile.photos[0] || '/src/assets/images/nikah_covenant_rings_1793004992524.jpg';
  const secondaryPhoto = profile.photos[1];

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      {/* Photo Area */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer group" onClick={() => onViewDetails(profile)}>
        <img
          src={primaryPhoto}
          alt={`Photo de profil ${profile.prenomPseudo}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // graceful fallback
            (e.target as HTMLImageElement).src = '/src/assets/images/nikah_covenant_rings_1793004992524.jpg';
          }}
        />

        {/* Gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

        {/* 2 Photos Indicator & Code ID */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-stone-900/75 backdrop-blur-md text-amber-200 text-[11px] font-mono tabular-nums px-2.5 py-1 rounded-md border border-white/10">
            {profile.codeId}
          </div>
          <div className="bg-stone-900/75 backdrop-blur-md text-stone-200 text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
            <Camera className="w-3 h-3 text-amber-300" />
            <span>2 photos certifiées</span>
          </div>
        </div>

        {/* Bottom overlay text on image */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <h3 className="font-serif text-lg font-bold leading-tight">
            {profile.prenomPseudo}, <span className="tabular-nums font-sans font-normal text-amber-200">{profile.age} ans</span>
          </h3>
          <div className="flex items-center gap-2 text-xs text-stone-300 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {profile.ville}
            </span>
            <span aria-hidden="true">·</span>
            <span>{profile.sexe === 'FEMME' ? 'Sœur' : 'Frère'}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Unboxed Metadata list according to zero-pill rules */}
        <div className="space-y-2.5">
          <div className="text-xs text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-medium text-stone-800">{profile.situationMatrimoniale}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{profile.profession}</span>
          </div>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
            « {profile.presentation} »
          </p>

          <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100 flex items-center justify-between">
            <span>Recherche : {profile.rechercheSexe === 'FEMME' ? 'Femme' : 'Homme'} ({profile.rechercheAgeMin}-{profile.rechercheAgeMax} ans)</span>
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Validé
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(profile)}
            className="w-full py-2 px-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap text-center"
          >
            Voir profil complet
          </button>
          <button
            onClick={() => onRequestContact(profile)}
            className="w-full py-2 px-2 text-xs font-semibold text-amber-50 bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-1"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Mise en contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};
