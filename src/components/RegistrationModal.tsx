import React, { useState } from 'react';
import { X, Upload, Camera, Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { NigerCity, Gender, MaritalStatus, Profile } from '../types/nikah';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProfile: (newProfile: Profile) => void;
}

const NIGER_CITIES: NigerCity[] = [
  'Niamey',
  'Maradi',
  'Zinder',
  'Tahoua',
  'Agadez',
  'Tillabéri',
  'Dosso',
  'Diffa',
  'Diaspora / Autre',
];

const MARITAL_STATUSES: MaritalStatus[] = [
  'Célibataire (jamais marié)',
  'Divorcé(e)',
  'Veuf / Veuve',
  'Marié (recherche 2ème/3ème épouse)',
  'Polygamie acceptée',
];

const SAMPLE_PRESET_PHOTOS_MEN = [
  '/src/assets/images/avatar_niger_brother_1793004993517.jpg',
  '/src/assets/images/hero_nikah_niger_1793004992113.jpg',
];

const SAMPLE_PRESET_PHOTOS_WOMEN = [
  '/src/assets/images/avatar_niger_sister_1793004993199.jpg',
  '/src/assets/images/nikah_covenant_rings_1793004992524.jpg',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitProfile,
}) => {
  const [prenomPseudo, setPrenomPseudo] = useState('');
  const [age, setAge] = useState<number>(25);
  const [ville, setVille] = useState<NigerCity>('Niamey');
  const [sexe, setSexe] = useState<Gender>('FEMME');
  const [situationMatrimoniale, setSituationMatrimoniale] = useState<MaritalStatus>('Célibataire (jamais marié)');
  const [rechercheSexe, setRechercheSexe] = useState<Gender>('HOMME');
  const [rechercheAgeMin, setRechercheAgeMin] = useState<number>(27);
  const [rechercheAgeMax, setRechercheAgeMax] = useState<number>(37);
  const [profession, setProfession] = useState('');
  const [niveauEtudes, setNiveauEtudes] = useState('');
  const [pratiqueReligieuse, setPratiqueReligieuse] = useState('');
  const [projetFamille, setProjetFamille] = useState('');
  const [presentation, setPresentation] = useState('');

  // 2 photos obligatoires
  const [photo1, setPhoto1] = useState<string>('');
  const [photo2, setPhoto2] = useState<string>('');

  // Confidential Contacts
  const [telephone, setTelephone] = useState('+227 ');
  const [whatsapp, setWhatsapp] = useState('+227 ');
  const [nomCompletWali, setNomCompletWali] = useState('');
  const [telephoneWali, setTelephoneWali] = useState('');

  const [honorPledge, setHonorPledge] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('La photo ne doit pas dépasser 5 Mo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (slot === 1) setPhoto1(reader.result as string);
        if (slot === 2) setPhoto2(reader.result as string);
        setErrorMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePresetPhotos = () => {
    if (sexe === 'FEMME') {
      setPhoto1(SAMPLE_PRESET_PHOTOS_WOMEN[0]);
      setPhoto2(SAMPLE_PRESET_PHOTOS_WOMEN[1]);
    } else {
      setPhoto1(SAMPLE_PRESET_PHOTOS_MEN[0]);
      setPhoto2(SAMPLE_PRESET_PHOTOS_MEN[1]);
    }
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!prenomPseudo.trim()) {
      setErrorMessage('Veuillez renseigner un prénom ou pseudo.');
      return;
    }

    if (age < 18 || age > 80) {
      setErrorMessage('L’âge doit être compris entre 18 et 80 ans.');
      return;
    }

    if (!profession.trim()) {
      setErrorMessage('Veuillez renseigner votre profession ou activité.');
      return;
    }

    if (!presentation.trim() || presentation.trim().length < 30) {
      setErrorMessage('Veuillez rédiger une présentation d’au moins 30 caractères décrivant votre personne et vos attentes.');
      return;
    }

    // 2 photos obligatoires
    if (!photo1 || !photo2) {
      setErrorMessage('2 photos décentes et obligatoires doivent être fournies.');
      return;
    }

    if (!telephone.trim() || telephone.trim() === '+227') {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone personnel (il restera strictement confidentiel).');
      return;
    }

    if (!honorPledge) {
      setErrorMessage('Veuillez accepter l’engagement sur l’honneur et la charte islamique du Nikah.');
      return;
    }

    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      codeId: `NK-227-${randomSuffix}`,
      prenomPseudo: prenomPseudo.trim(),
      age: Number(age),
      ville,
      sexe,
      situationMatrimoniale,
      rechercheSexe,
      rechercheAgeMin: Number(rechercheAgeMin),
      rechercheAgeMax: Number(rechercheAgeMax),
      profession: profession.trim(),
      niveauEtudes: niveauEtudes.trim() || 'Non précisé',
      pratiqueReligieuse: pratiqueReligieuse.trim() || 'Pratique régulière des obligations islamiques',
      projetFamille: projetFamille.trim() || 'Fonder un foyer selon la Sunnah',
      presentation: presentation.trim(),
      photos: [photo1, photo2],
      contact: {
        telephone: telephone.trim(),
        whatsapp: whatsapp.trim() || telephone.trim(),
        nomCompletWali: nomCompletWali.trim() || undefined,
        telephoneWali: telephoneWali.trim() || undefined,
        remarquesConfidentielles: 'Nouveau profil soumis en attente d’approbation.',
      },
      status: 'EN_ATTENTE',
      createdAt: new Date().toISOString(),
    };

    onSubmitProfile(newProfile);
    setIsSubmitted(true);
  };

  const handleCloseAndReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Inscription & Dépôt de profil matrimonial
            </h2>
            <p className="text-xs text-stone-500">
              Le profil restera en attente jusqu’à validation par l’administrateur
            </p>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Profil soumis avec succès !
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Votre profil a bien été enregistré avec le statut{' '}
                <strong className="text-amber-800 font-semibold">« En attente de validation »</strong>.
                Notre administrateur va vérifier vos 2 photos et informations afin de garantir le respect de l’éthique et de la Sunnah.
              </p>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 max-w-md mx-auto text-xs text-stone-600 text-left space-y-1.5">
                <div className="font-semibold text-stone-900">Ce qui se passe ensuite :</div>
                <div>1. L'administrateur valide la décence et le sérieux de l'annonce.</div>
                <div>2. Le profil apparaîtra sur la plateforme publique sans vos coordonnées.</div>
                <div>3. Toute personne intéressée devra régler les frais de mise en contact par MyNita ou AmanaTa.</div>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleCloseAndReset}
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
                >
                  Compris, fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Notice */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Règle de pudeur :</strong> Vos coordonnées personnelles (numéros de téléphone et WhatsApp) ne seront <strong>jamais affichées publiquement</strong>. Seuls votre prénom/pseudo, ville, et présentation seront visibles après validation.
                </p>
              </div>

              {/* 1. Identité et Localisation */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-emerald-900">
                  1. Identité & Localisation au Niger
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Prénom ou Pseudo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Mariama, Abou Bakr, Fatima..."
                      value={prenomPseudo}
                      onChange={(e) => setPrenomPseudo(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Âge (ans) *
                    </label>
                    <input
                      type="number"
                      required
                      min={18}
                      max={80}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Sexe *
                    </label>
                    <select
                      value={sexe}
                      onChange={(e) => {
                        const newSexe = e.target.value as Gender;
                        setSexe(newSexe);
                        setRechercheSexe(newSexe === 'FEMME' ? 'HOMME' : 'FEMME');
                      }}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    >
                      <option value="FEMME">Femme (Sœur)</option>
                      <option value="HOMME">Homme (Frère)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Ville de résidence au Niger *
                    </label>
                    <select
                      value={ville}
                      onChange={(e) => setVille(e.target.value as NigerCity)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    >
                      {NIGER_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Situation & Recherche */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-emerald-900">
                  2. Situation Matrimoniale & Recherche
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Situation matrimoniale actuelle *
                    </label>
                    <select
                      value={situationMatrimoniale}
                      onChange={(e) => setSituationMatrimoniale(e.target.value as MaritalStatus)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    >
                      {MARITAL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Vous recherchez *
                    </label>
                    <select
                      value={rechercheSexe}
                      onChange={(e) => setRechercheSexe(e.target.value as Gender)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    >
                      <option value="HOMME">Un Homme</option>
                      <option value="FEMME">Une Femme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Tranche d'âge recherchée
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={18}
                        max={80}
                        value={rechercheAgeMin}
                        onChange={(e) => setRechercheAgeMin(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                        placeholder="Min"
                      />
                      <span className="text-stone-400">à</span>
                      <input
                        type="number"
                        min={18}
                        max={80}
                        value={rechercheAgeMax}
                        onChange={(e) => setRechercheAgeMax(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Profession / Activité *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Enseignant(e), Commerçant(e), Ingénieur, etc."
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Présentation & Vision */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-emerald-900">
                  3. Présentation & Projet Matrimonial
                </h3>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Présentation personnelle (valeurs, personnalité, attentes) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Présentez-vous en toute sincérité : vos qualités, votre tempérament, ce que vous attendez de votre futur conjoint..."
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Pratique religieuse & Sunnah
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Assiduité aux 5 prières, Coran, pudeur..."
                      value={pratiqueReligieuse}
                      onChange={(e) => setPratiqueReligieuse(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Niveau d'études
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Licence, Master, Diplôme d’État, Lycée..."
                      value={niveauEtudes}
                      onChange={(e) => setNiveauEtudes(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* 4. 2 Photos Obligatoires */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-800" />
                    <span>4. Deux Photos Décentes Obligatoires *</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleUsePresetPhotos}
                    className="text-[11px] text-emerald-800 hover:underline font-medium"
                  >
                    Utiliser photos exemples
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  Pour préserver la dignité, les photos doivent être décentes (tenue pudique, visage dégagé). Elles seront vérifiées avant mise en ligne.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo 1 */}
                  <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-semibold text-stone-700">Photo 1 (Visage / Portrait)</span>
                    {photo1 ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-stone-300">
                        <img src={photo1} alt="Aperçu 1" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhoto1('')}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-28 border-2 border-dashed border-stone-300 hover:border-emerald-700 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                        <Upload className="w-6 h-6 text-stone-400 mb-1" />
                        <span className="text-xs text-stone-600 font-medium">Ajouter la Photo 1</span>
                        <span className="text-[10px] text-stone-400">JPG, PNG (max 5 Mo)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 1)}
                        />
                      </label>
                    )}
                  </div>

                  {/* Photo 2 */}
                  <div className="border border-stone-200 rounded-xl p-3 bg-stone-50 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-semibold text-stone-700">Photo 2 (Silhouette / Contexte décent)</span>
                    {photo2 ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-stone-300">
                        <img src={photo2} alt="Aperçu 2" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhoto2('')}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-28 border-2 border-dashed border-stone-300 hover:border-emerald-700 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                        <Upload className="w-6 h-6 text-stone-400 mb-1" />
                        <span className="text-xs text-stone-600 font-medium">Ajouter la Photo 2</span>
                        <span className="text-[10px] text-stone-400">JPG, PNG (max 5 Mo)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 2)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Coordonnées Confidentielles */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-emerald-900">
                  5. Coordonnées Confidentielles (Non publiques)
                </h3>
                <p className="text-xs text-stone-500">
                  Ces informations sont réservées à l'administration pour vous joindre et pour la mise en contact sécurisée.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+227 9X XX XX XX"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Numéro WhatsApp (si différent)
                    </label>
                    <input
                      type="tel"
                      placeholder="+227 9X XX XX XX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>

                  {sexe === 'FEMME' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Nom & Qualité du Tuteur légal (Wali)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex : Mallam Harouna (Père), Elhadj Oumarou (Oncle)"
                          value={nomCompletWali}
                          onChange={(e) => setNomCompletWali(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Téléphone du Tuteur (Wali)
                        </label>
                        <input
                          type="tel"
                          placeholder="+227 9X XX XX XX"
                          value={telephoneWali}
                          onChange={(e) => setTelephoneWali(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Engagement sur l'honneur */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={honorPledge}
                    onChange={(e) => setHonorPledge(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-emerald-900 focus:ring-emerald-800"
                  />
                  <span>
                    Je jure par Allah que mes informations sont véridiques, que ma démarche a pour but unique le mariage islamique licite (Nikah), et j'accepte que mon profil soit soumis à la validation de l'administrateur.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
                >
                  Soumettre mon profil pour validation
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
