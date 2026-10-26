import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { Profile, ContactRequest, PaymentMethod, AdminSettings, NigerCity } from '../types/nikah';
import { buildPaymentProofWhatsAppLink, OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface ContactRequestModalProps {
  profile: Profile | null;
  adminSettings: AdminSettings;
  onClose: () => void;
  onSubmitRequest: (request: ContactRequest) => void;
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

export const ContactRequestModal: React.FC<ContactRequestModalProps> = ({
  profile,
  adminSettings,
  onClose,
  onSubmitRequest,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [demandeurNom, setDemandeurNom] = useState('');
  const [demandeurAge, setDemandeurAge] = useState<number>(28);
  const [demandeurVille, setDemandeurVille] = useState<NigerCity>('Niamey');
  const [demandeurProfession, setDemandeurProfession] = useState('');
  const [demandeurTelephone, setDemandeurTelephone] = useState('+227 ');
  const [demandeurWhatsApp, setDemandeurWhatsApp] = useState('+227 ');
  const [demandeurMotif, setDemandeurMotif] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MYNITA');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [createdRequest, setCreatedRequest] = useState<ContactRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!profile) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentProofUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!demandeurNom.trim()) {
      setErrorMessage('Veuillez saisir votre nom complet.');
      return;
    }

    if (demandeurAge < 18) {
      setErrorMessage('Vous devez avoir au moins 18 ans.');
      return;
    }

    if (!demandeurTelephone.trim() || demandeurTelephone.trim() === '+227') {
      setErrorMessage('Veuillez renseigner un numéro de téléphone valide.');
      return;
    }

    if (!demandeurMotif.trim() || demandeurMotif.trim().length < 20) {
      setErrorMessage('Veuillez expliquer brièvement vos motivations pour cette mise en relation matrimoniale.');
      return;
    }

    setStep(2);
  };

  const handleConfirmPayment = () => {
    if (!paymentReference.trim() && !paymentProofUrl) {
      setErrorMessage('Veuillez renseigner le numéro de transaction / SMS ou charger la capture d’écran.');
      return;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const reqCode = `DEM-227-${randomNum}`;

    const newRequest: ContactRequest = {
      id: `req-${Date.now()}`,
      requestCode: reqCode,
      targetProfileId: profile.id,
      targetProfileCode: profile.codeId,
      targetProfilePseudo: `${profile.prenomPseudo} (${profile.age} ans, ${profile.ville})`,
      targetProfileCity: profile.ville,
      demandeurNom: demandeurNom.trim(),
      demandeurAge: Number(demandeurAge),
      demandeurVille,
      demandeurProfession: demandeurProfession.trim() || 'Non précisé',
      demandeurTelephone: demandeurTelephone.trim(),
      demandeurWhatsApp: demandeurWhatsApp.trim() || demandeurTelephone.trim(),
      demandeurMotif: demandeurMotif.trim(),
      paymentMethod,
      paymentReference: paymentReference.trim() || 'Preuve capture fournie',
      paymentProofUrl: paymentProofUrl || undefined,
      feeAmountFcfa: adminSettings.contactFeeFcfa || 3000,
      status: 'EN_ATTENTE_VERIFICATION',
      createdAt: new Date().toISOString(),
    };

    onSubmitRequest(newRequest);
    setCreatedRequest(newRequest);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Demande de mise en contact matrimoniale
            </h2>
            <p className="text-xs text-stone-500">
              Profil visé : <span className="font-semibold text-emerald-950">{profile.prenomPseudo}</span> ({profile.codeId} · {profile.ville})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-medium ${step >= 1 ? 'text-emerald-900' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>1</span>
            <span>Vos informations</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 font-medium ${step >= 2 ? 'text-emerald-900' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>2</span>
            <span>Paiement MyNita / Amanata</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 font-medium ${step === 3 ? 'text-emerald-900' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-emerald-900 text-white' : 'bg-stone-300 text-stone-600'}`}>3</span>
            <span>Preuve WhatsApp</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6">
          {errorMessage && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1 : Infos demandeur */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600 leading-relaxed">
                Les coordonnées du profil ne sont transmises qu'après vérification du sérieux de votre démarche et acquittement des frais de médiation.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Ousmane Abdoulaye"
                    value={demandeurNom}
                    onChange={(e) => setDemandeurNom(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre âge (ans) *
                  </label>
                  <input
                    type="number"
                    required
                    min={18}
                    max={85}
                    value={demandeurAge}
                    onChange={(e) => setDemandeurAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre ville de résidence *
                  </label>
                  <select
                    value={demandeurVille}
                    onChange={(e) => setDemandeurVille(e.target.value as NigerCity)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                  >
                    {NIGER_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Votre profession
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Agent comptable, Commerçant, etc."
                    value={demandeurProfession}
                    onChange={(e) => setDemandeurProfession(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Numéro de Téléphone d'appel *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+227 9X XX XX XX"
                    value={demandeurTelephone}
                    onChange={(e) => setDemandeurTelephone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Numéro WhatsApp actif
                  </label>
                  <input
                    type="tel"
                    placeholder="+227 9X XX XX XX"
                    value={demandeurWhatsApp}
                    onChange={(e) => setDemandeurWhatsApp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Message de motivation / Projet pour ce profil *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Expliquez brièvement pourquoi ce profil correspond à votre recherche et confirmez votre engagement sérieux envers le mariage islamique..."
                  value={demandeurMotif}
                  onChange={(e) => setDemandeurMotif(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Passer au règlement ({adminSettings.contactFeeFcfa.toLocaleString()} FCFA)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 : Règlement MyNita ou Amanata */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Fee notice */}
              <div className="bg-emerald-950 text-amber-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-300 font-medium">Frais de mise en contact & médiation</div>
                  <div className="text-2xl font-bold font-serif tabular-nums text-white">
                    {adminSettings.contactFeeFcfa.toLocaleString()} FCFA
                  </div>
                </div>
                <div className="text-right text-xs text-stone-300 max-w-[200px]">
                  Frais fixes servant à modérer, vérifier l'identité et assurer le suivi sérieux avec le tuteur.
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2">
                  Choisissez votre moyen de paiement au Niger :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('MYNITA')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'MYNITA'
                        ? 'border-emerald-800 bg-emerald-50/60 ring-2 ring-emerald-800/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-stone-900">Transfert MyNita</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Envoi vers le compte MyNita officiel</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('AMANATA')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'AMANATA'
                        ? 'border-emerald-800 bg-emerald-50/60 ring-2 ring-emerald-800/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-stone-900">Transfert AmanaTa</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">Envoi vers le guichet AmanaTa officiel</div>
                  </button>
                </div>
              </div>

              {/* Deposit Instructions Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-stone-900">
                  Instructions pour {paymentMethod === 'MYNITA' ? 'MyNita' : 'AmanaTa'} :
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Numéro de transfert officiel :</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {paymentMethod === 'MYNITA'
                          ? adminSettings.myNitaDepositNumber
                          : adminSettings.amanaTaDepositNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          paymentMethod === 'MYNITA'
                            ? adminSettings.myNitaDepositNumber
                            : adminSettings.amanaTaDepositNumber,
                          'num'
                        )
                      }
                      className="p-1.5 rounded text-stone-600 hover:bg-stone-100 flex items-center gap-1 text-[11px]"
                    >
                      {copiedField === 'num' ? (
                        <Check className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>Copier</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">Nom du compte / Destinataire :</span>
                    <span className="font-medium text-stone-900">
                      {paymentMethod === 'MYNITA'
                        ? adminSettings.myNitaAccountName
                        : adminSettings.amanaTaAccountName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Reference & Screenshot Input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Numéro de transaction / Référence du SMS reçu *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : MN-849201 ou AM-382902 ou code SMS"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Capture d'écran du reçu / SMS (optionnel mais recommandé)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg cursor-pointer flex items-center gap-2 border border-stone-300">
                      <Upload className="w-4 h-4" />
                      <span>{paymentProofUrl ? 'Remplacer capture' : 'Charger capture reçu'}</span>
                      <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" />
                    </label>
                    {paymentProofUrl && (
                      <span className="text-xs text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Capture enregistrée
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Confirmer & Envoyer preuve sur WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 : Confirmation & WhatsApp Business */}
          {step === 3 && createdRequest && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Demande enregistrée avec succès !
                </h3>
                <p className="text-xs font-mono text-emerald-900 mt-1 font-bold">
                  Code de dossier : {createdRequest.requestCode}
                </p>
                <p className="text-xs text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Pour valider définitivement votre paiement et autoriser la mise en contact avec{' '}
                  <strong>{profile.prenomPseudo}</strong>, envoyez votre preuve sur le WhatsApp Business officiel.
                </p>
              </div>

              {/* WhatsApp Action Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-800" />
                    <span className="font-bold text-xs text-emerald-950">
                      WhatsApp Business Officiel : {adminSettings.whatsappBusiness || OFFICIAL_WHATSAPP_NUMBER}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  Cliquez sur le bouton ci-dessous pour ouvrir WhatsApp avec le message officiel pré-rempli. Joignez simplement la capture de votre SMS MyNita/AmanaTa.
                </p>

                <a
                  href={buildPaymentProofWhatsAppLink(createdRequest, adminSettings.whatsappBusiness)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la preuve sur WhatsApp Business ({adminSettings.whatsappBusiness})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* What happens next */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs text-stone-600 max-w-lg mx-auto space-y-1.5">
                <div className="font-semibold text-stone-900">Suite des étapes :</div>
                <div>1. L'administrateur vérifie la réception des {createdRequest.feeAmountFcfa.toLocaleString()} FCFA.</div>
                <div>2. L'administrateur prend contact avec le profil ou son tuteur (Wali).</div>
                <div>3. Les coordonnées privées vous sont transmises sous 24h par WhatsApp.</div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-600 hover:text-stone-900 underline"
                >
                  Fermer cette fenêtre et revenir aux profils
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
