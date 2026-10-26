import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  CreditCard,
  Clock,
  Trash2,
  Ban,
  CheckCircle,
  ExternalLink,
  Lock,
  Unlock,
  Edit,
  Eye,
  Settings,
  AlertTriangle,
  RotateCcw,
  Send,
  Camera,
  MapPin,
  Phone,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { GmailNotificationCenter } from './GmailNotificationCenter';
import {
  Profile,
  ContactRequest,
  AdminSettings,
  ProfileStatus,
  ContactRequestStatus,
  Gender,
  NigerCity,
} from '../types/nikah';
import {
  buildPaymentProofWhatsAppLink,
  buildOfficialContactReleaseMessage,
  OFFICIAL_WHATSAPP_NUMBER,
} from '../utils/whatsapp';

interface AdminDashboardProps {
  profiles: Profile[];
  contactRequests: ContactRequest[];
  adminSettings: AdminSettings;
  onUpdateProfiles: (profiles: Profile[]) => void;
  onUpdateContactRequests: (requests: ContactRequest[]) => void;
  onUpdateAdminSettings: (settings: AdminSettings) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  contactRequests,
  adminSettings,
  onUpdateProfiles,
  onUpdateContactRequests,
  onUpdateAdminSettings,
  onResetData,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pending' | 'members' | 'payments' | 'gmail' | 'settings'>('pending');

  // Inspection & Edit State
  const [inspectingProfile, setInspectingProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Member Filter State
  const [memberFilterStatus, setMemberFilterStatus] = useState<'ALL' | ProfileStatus>('ALL');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Release Contact Modal / Drawer
  const [releasingRequest, setReleasingRequest] = useState<ContactRequest | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<AdminSettings>(adminSettings);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Handle PIN Unlock
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === adminSettings.adminPin || enteredPin === '2270') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Profile Action Handlers
  const handleApproveProfile = (profileId: string) => {
    const updated = profiles.map((p) =>
      p.id === profileId
        ? {
            ...p,
            status: 'VALIDE' as ProfileStatus,
            verifiedAt: new Date().toISOString(),
          }
        : p
    );
    onUpdateProfiles(updated);
    if (inspectingProfile?.id === profileId) {
      setInspectingProfile(null);
    }
  };

  const handleMarkSuspect = (profileId: string) => {
    const reason = prompt(
      'Motif du signalement suspect / fausse annonce :',
      'Profil non sérieux ou suspicion d’inauthenticité'
    );
    if (reason === null) return;

    const updated = profiles.map((p) =>
      p.id === profileId
        ? {
            ...p,
            status: 'SUSPECT' as ProfileStatus,
            adminNote: reason,
          }
        : p
    );
    onUpdateProfiles(updated);
    if (inspectingProfile?.id === profileId) setInspectingProfile(null);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (
      confirm(
        'Êtes-vous certain de vouloir supprimer définitivement ce profil ? Cette action est irréversible.'
      )
    ) {
      const updated = profiles.filter((p) => p.id !== profileId);
      onUpdateProfiles(updated);
      if (inspectingProfile?.id === profileId) setInspectingProfile(null);
    }
  };

  const handleSaveEditedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    const updated = profiles.map((p) =>
      p.id === editingProfile.id ? editingProfile : p
    );
    onUpdateProfiles(updated);
    setEditingProfile(null);
  };

  // Payment & Contact Request Handlers
  const handleApprovePaymentAndContact = (request: ContactRequest) => {
    const targetProfile = profiles.find((p) => p.id === request.targetProfileId);
    setReleasingRequest(request);
  };

  const handleConfirmRelease = (requestId: string) => {
    const updated = contactRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'CONTACT_TRANSMIS' as ContactRequestStatus,
            processedAt: new Date().toISOString(),
            adminNote: 'Paiement vérifié sur MyNita/AmanaTa. Coordonnées transmises.',
          }
        : r
    );
    onUpdateContactRequests(updated);
    setReleasingRequest(null);
  };

  const handleRejectRequest = (requestId: string) => {
    const reason = prompt('Motif du rejet du paiement / demande :', 'Preuve non reçue ou invalide');
    if (reason === null) return;

    const updated = contactRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'REFUSE' as ContactRequestStatus,
            processedAt: new Date().toISOString(),
            adminNote: reason,
          }
        : r
    );
    onUpdateContactRequests(updated);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdminSettings(settingsForm);
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  // KPIs
  const totalProfilesCount = profiles.length;
  const pendingProfilesCount = profiles.filter((p) => p.status === 'EN_ATTENTE').length;
  const validProfilesCount = profiles.filter((p) => p.status === 'VALIDE').length;
  const suspectProfilesCount = profiles.filter((p) => p.status === 'SUSPECT').length;
  const pendingRequestsCount = contactRequests.filter(
    (r) => r.status === 'EN_ATTENTE_VERIFICATION'
  ).length;
  const approvedPaymentsTotal = contactRequests
    .filter((r) => r.status === 'PAIEMENT_VALIDE' || r.status === 'CONTACT_TRANSMIS')
    .reduce((sum, r) => sum + r.feeAmountFcfa, 0);

  // If not authenticated, show PIN Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-900 text-amber-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Espace Administration Privé
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Validation des profils, modération des photos et gestion des paiements MyNita/Amanata.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Entrez votre code secret PIN :
              </label>
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="Ex : 2270"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className={`w-full text-center tracking-widest text-lg font-mono py-2.5 px-4 bg-stone-50 border rounded-xl focus:outline-none focus:ring-2 ${
                  pinError
                    ? 'border-rose-400 focus:ring-rose-200 text-rose-700'
                    : 'border-stone-300 focus:ring-emerald-800/30'
                }`}
              />
              {pinError && (
                <p className="text-xs text-rose-600 mt-1.5">
                  Code PIN incorrect. Le code par défaut est <strong>2270</strong>.
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full bg-emerald-900 hover:bg-emerald-800 text-amber-50 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Déverrouiller le tableau de bord
              </button>

              <button
                type="button"
                onClick={() => {
                  setEnteredPin('2270');
                  setIsAuthenticated(true);
                }}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline"
              >
                Déverrouillage rapide pour test (PIN : 2270)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const pendingProfiles = profiles.filter((p) => p.status === 'EN_ATTENTE');
  const filteredMembers = profiles.filter((p) => {
    const matchesStatus =
      memberFilterStatus === 'ALL' ? true : p.status === memberFilterStatus;
    const matchesSearch =
      !memberSearchQuery.trim() ||
      p.prenomPseudo.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      p.codeId.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      p.ville.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      p.profession.toLowerCase().includes(memberSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Tableau de bord Administrateur
            </h1>
            <span className="text-[11px] bg-emerald-100 text-emerald-950 font-semibold px-2 py-0.5 rounded">
              Supervision Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestion des membres, validation des photos et autorisation des mises en contact.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-[11px] text-stone-400">WhatsApp Business :</span>
            <span className="font-mono text-xs font-bold text-emerald-950">
              {adminSettings.whatsappBusiness || OFFICIAL_WHATSAPP_NUMBER}
            </span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 hover:bg-stone-200 py-1.5 px-3 rounded-lg transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Verrouiller</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium">Total Profils</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1 tabular-nums">
            {totalProfilesCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/30">
          <div className="text-[11px] text-amber-800 font-medium flex items-center justify-between">
            <span>En attente</span>
            <Clock className="w-3 h-3 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-amber-900 mt-1 tabular-nums">
            {pendingProfilesCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/30">
          <div className="text-[11px] text-emerald-800 font-medium flex items-center justify-between">
            <span>Validés</span>
            <CheckCircle className="w-3 h-3 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-1 tabular-nums">
            {validProfilesCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium flex items-center justify-between">
            <span>Paiements en attente</span>
            <CreditCard className="w-3 h-3 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1 tabular-nums">
            {pendingRequestsCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <div className="text-[11px] text-stone-500 font-medium">Total Encaissé (FCFA)</div>
          <div className="text-lg font-bold font-serif text-emerald-900 mt-1 tabular-nums">
            {approvedPaymentsTotal.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="text-[11px] text-rose-800 font-medium flex items-center justify-between">
            <span>Suspects / Bloqués</span>
            <Ban className="w-3 h-3 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-rose-900 mt-1 tabular-nums">
            {suspectProfilesCount}
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit border border-stone-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Profils en attente</span>
          {pendingProfilesCount > 0 && (
            <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
              {pendingProfilesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'members'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Gestion des membres ({totalProfilesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Demandes & Paiements ({contactRequests.length})</span>
          {pendingRequestsCount > 0 && (
            <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('gmail')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'gmail'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-red-600" />
          <span>Notifications Gmail</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Paramètres & Numéros</span>
        </button>
      </div>

      {/* TAB 1 : PROFILS EN ATTENTE DE VALIDATION */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Profils soumis en attente de modération ({pendingProfiles.length})
            </h2>
            <p className="text-xs text-stone-500">
              Vérifiez la décence des 2 photos et la conformité avec l'éthique islamique avant acceptation.
            </p>
          </div>

          {pendingProfiles.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="text-sm font-semibold text-stone-800">
                Aucun profil en attente de validation
              </div>
              <p className="text-xs">
                Tous les nouveaux profils soumis ont été examinés par l'administrateur.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-amber-300 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Header with Code */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
                          {p.codeId}
                        </span>
                        <span className="text-xs text-amber-800 font-medium">En attente</span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Name & Basic Info */}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        {p.prenomPseudo}, {p.age} ans
                      </h3>
                      <div className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                        <span>{p.ville} (Niger)</span>
                        <span>·</span>
                        <span>{p.sexe === 'FEMME' ? 'Sœur' : 'Frère'}</span>
                        <span>·</span>
                        <span>{p.situationMatrimoniale}</span>
                      </div>
                    </div>

                    {/* Photos Inspection */}
                    <div>
                      <div className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-stone-500" />
                        <span>Contrôle des 2 photos obligatoires :</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {p.photos.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setPreviewPhoto(img)}
                            className="relative aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 cursor-pointer group bg-stone-100"
                          >
                            <img
                              src={img}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                              <Eye className="w-4 h-4 mr-1" /> Agrandir
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                              Photo {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Details Snippet */}
                    <div className="text-xs space-y-2 bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                      <div>
                        <strong className="text-stone-700">Profession : </strong>
                        <span>{p.profession}</span>
                      </div>
                      <div>
                        <strong className="text-stone-700">Présentation : </strong>
                        <p className="text-stone-600 mt-0.5 italic">« {p.presentation} »</p>
                      </div>
                      <div className="pt-1 border-t border-stone-200/60 text-stone-500">
                        <strong className="text-stone-700">Contact privé : </strong>
                        <span>{p.contact.telephone}</span>
                        {p.contact.nomCompletWali && (
                          <span className="block mt-0.5">
                            Wali : {p.contact.nomCompletWali} ({p.contact.telephoneWali})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkSuspect(p.id)}
                        className="py-1.5 px-2.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1"
                        title="Marquer comme profil suspect"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Suspect</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(p.id)}
                        className="py-1.5 px-2.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                        title="Supprimer la fausse annonce"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProfile(p)}
                        className="py-1.5 px-3 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleApproveProfile(p.id)}
                        className="py-1.5 px-4 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                        <span>Valider & Publier</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2 : GESTION DE TOUS LES MEMBRES */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher par nom, code ou ville..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Statut :</span>
              <select
                value={memberFilterStatus}
                onChange={(e) => setMemberFilterStatus(e.target.value as any)}
                className="py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="VALIDE">Validés uniquement</option>
                <option value="EN_ATTENTE">En attente uniquement</option>
                <option value="SUSPECT">Suspects / Bloqués</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Code / Membre</th>
                    <th className="py-3 px-4">Ville & Âge</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Photos</th>
                    <th className="py-3 px-4">Contact Confidentiel</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{m.prenomPseudo}</div>
                        <div className="font-mono text-[11px] text-stone-400">{m.codeId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{m.ville}</div>
                        <div className="text-stone-500 tabular-nums">{m.age} ans · {m.sexe}</div>
                      </td>
                      <td className="py-3 px-4">
                        {m.status === 'VALIDE' && (
                          <span className="text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Validé
                          </span>
                        )}
                        {m.status === 'EN_ATTENTE' && (
                          <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            En attente
                          </span>
                        )}
                        {m.status === 'SUSPECT' && (
                          <span className="text-rose-800 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Suspect / Bloqué
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {m.photos.map((p, idx) => (
                            <img
                              key={idx}
                              src={p}
                              alt=""
                              onClick={() => setPreviewPhoto(p)}
                              className="w-7 h-7 rounded object-cover cursor-pointer hover:opacity-80"
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{m.contact.telephone}</div>
                        {m.contact.nomCompletWali && (
                          <div className="text-[10px] text-stone-400">
                            Wali: {m.contact.nomCompletWali}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {m.status !== 'VALIDE' && (
                            <button
                              onClick={() => handleApproveProfile(m.id)}
                              className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded"
                              title="Valider"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingProfile(m)}
                            className="p-1.5 text-stone-600 hover:bg-stone-100 rounded"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {m.status !== 'SUSPECT' && (
                            <button
                              onClick={() => handleMarkSuspect(m.id)}
                              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded"
                              title="Signaler suspect"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteProfile(m.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 : DEMANDES DE CONTACT & PAIEMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Demandes de mise en contact & Paiements MyNita / Amanata ({contactRequests.length})
            </h2>
            <div className="text-xs text-stone-500">
              Frais officiels : <strong>{adminSettings.contactFeeFcfa.toLocaleString()} FCFA</strong> par mise en contact
            </div>
          </div>

          <div className="space-y-4">
            {contactRequests.map((req) => {
              const targetProfile = profiles.find((p) => p.id === req.targetProfileId);

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm space-y-4 ${
                    req.status === 'EN_ATTENTE_VERIFICATION'
                      ? 'border-emerald-500/70 ring-1 ring-emerald-500/20'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold bg-stone-100 px-2.5 py-1 rounded">
                        {req.requestCode}
                      </span>
                      <span className="text-xs font-semibold text-stone-900">
                        {req.paymentMethod === 'MYNITA' ? 'Transfert MyNita' : 'Transfert AmanaTa'}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {req.feeAmountFcfa.toLocaleString()} FCFA
                      </span>
                    </div>

                    <div>
                      {req.status === 'EN_ATTENTE_VERIFICATION' && (
                        <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded">
                          Paiement à vérifier
                        </span>
                      )}
                      {req.status === 'PAIEMENT_VALIDE' && (
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded">
                          Paiement Validé
                        </span>
                      )}
                      {req.status === 'CONTACT_TRANSMIS' && (
                        <span className="text-xs font-semibold text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded">
                          Mise en relation effectuée
                        </span>
                      )}
                      {req.status === 'REFUSE' && (
                        <span className="text-xs font-semibold text-rose-800 bg-rose-100/80 px-2.5 py-1 rounded">
                          Refusé
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Request Detail Split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Demandeur */}
                    <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200/80 space-y-1.5">
                      <div className="font-semibold text-stone-900">Demandeur :</div>
                      <div>
                        <strong>{req.demandeurNom}</strong> ({req.demandeurAge} ans, {req.demandeurVille})
                      </div>
                      <div>
                        Tél : <span className="font-mono">{req.demandeurTelephone}</span> · WhatsApp :{' '}
                        <span className="font-mono">{req.demandeurWhatsApp}</span>
                      </div>
                      <div>Profession : {req.demandeurProfession}</div>
                      <div className="text-stone-600 italic pt-1 border-t border-stone-200">
                        « {req.demandeurMotif} »
                      </div>
                    </div>

                    {/* Target & Payment Details */}
                    <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200/80 space-y-1.5">
                      <div className="font-semibold text-stone-900">Profil Ciblé & Paiement :</div>
                      <div>
                        Cible : <strong>{req.targetProfilePseudo}</strong> ({req.targetProfileCode})
                      </div>
                      <div>
                        Réf. Transaction déclarée :{' '}
                        <span className="font-mono font-bold text-stone-900">{req.paymentReference}</span>
                      </div>
                      {req.paymentProofUrl && (
                        <div>
                          <button
                            onClick={() => setPreviewPhoto(req.paymentProofUrl!)}
                            className="text-emerald-800 hover:underline flex items-center gap-1 font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Voir capture d'écran du paiement</span>
                          </button>
                        </div>
                      )}
                      {targetProfile && (
                        <div className="pt-1 border-t border-stone-200 text-stone-500">
                          Contact confidentiel du profil :{' '}
                          <span className="font-semibold text-stone-900">
                            {targetProfile.contact.telephone}
                          </span>
                          {targetProfile.contact.nomCompletWali && (
                            <span className="block">
                              Wali : {targetProfile.contact.nomCompletWali} ({targetProfile.contact.telephoneWali})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for Request */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <div className="text-[11px] text-stone-400">
                      Reçu le : {new Date(req.createdAt).toLocaleString('fr-FR')}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'EN_ATTENTE_VERIFICATION' && (
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="py-1.5 px-3 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        >
                          Refuser
                        </button>
                      )}

                      {req.status !== 'CONTACT_TRANSMIS' && (
                        <button
                          onClick={() => handleApprovePaymentAndContact(req)}
                          className="py-1.5 px-4 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                          <span>Valider le paiement & Transmettre le contact</span>
                        </button>
                      )}

                      {req.status === 'CONTACT_TRANSMIS' && (
                        <button
                          onClick={() => handleApprovePaymentAndContact(req)}
                          className="py-1.5 px-3 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Revoir message WhatsApp transmis</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4 : PARAMÈTRES & CONFIGURATIONS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Paramètres de la plateforme & Comptes de paiement
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Configurez vos numéros de réception MyNita, AmanaTa et WhatsApp Business officiel.
            </p>
          </div>

          {settingsSavedSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Paramètres sauvegardés avec succès !</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Numéro WhatsApp Business officiel *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappBusiness}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsappBusiness: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                />
                <span className="text-[10px] text-stone-400">Recommandé : +227 99 61 40 98</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Frais de mise en contact (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  step={500}
                  value={settingsForm.contactFeeFcfa}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, contactFeeFcfa: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Numéro de dépôt / Transfert MyNita *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.myNitaDepositNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, myNitaDepositNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nom du compte MyNita
                </label>
                <input
                  type="text"
                  value={settingsForm.myNitaAccountName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, myNitaAccountName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Numéro de transfert AmanaTa *
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.amanaTaDepositNumber}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, amanaTaDepositNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nom du compte / Guichet AmanaTa
                </label>
                <input
                  type="text"
                  value={settingsForm.amanaTaAccountName}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, amanaTaAccountName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Code PIN secret d'accès Admin *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={settingsForm.adminPin}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, adminPin: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Voulez-vous réinitialiser toutes les données de test avec les profils de démonstration ?')) {
                    onResetData();
                  }
                }}
                className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser les données de démo</span>
              </button>

              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-amber-50 px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Enregistrer les paramètres
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5 : NOTIFICATIONS GMAIL */}
      {activeTab === 'gmail' && (
        <GmailNotificationCenter />
      )}

      {/* MODAL : PREVIEW PHOTO */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-xl">
            <img src={previewPhoto} alt="Agrandissement" className="w-full h-auto object-contain" />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MODAL : EDIT PROFILE */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Modifier le profil ({editingProfile.codeId})
              </h3>
              <button onClick={() => setEditingProfile(null)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Prénom / Pseudo</label>
                <input
                  type="text"
                  value={editingProfile.prenomPseudo}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, prenomPseudo: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Âge</label>
                  <input
                    type="number"
                    value={editingProfile.age}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, age: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    value={editingProfile.ville}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, ville: e.target.value as NigerCity })
                    }
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Profession</label>
                <input
                  type="text"
                  value={editingProfile.profession}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, profession: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Présentation</label>
                <textarea
                  rows={3}
                  value={editingProfile.presentation}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, presentation: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Statut</label>
                <select
                  value={editingProfile.status}
                  onChange={(e) =>
                    setEditingProfile({ ...editingProfile, status: e.target.value as ProfileStatus })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg bg-stone-50"
                >
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="VALIDE">Validé</option>
                  <option value="SUSPECT">Suspect / Bloqué</option>
                  <option value="REJETE">Rejeté</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-3 py-1.5 rounded-lg border text-stone-600 hover:bg-stone-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-900 text-white font-medium"
                >
                  Enregistrer modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : RELEASE CONTACT & SEND WHATSAPP MESSAGE */}
      {releasingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Autorisation & Transmission de Contact
              </h3>
              <button onClick={() => setReleasingRequest(null)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            {(() => {
              const target = profiles.find((p) => p.id === releasingRequest.targetProfileId);
              const contactPhone = target?.contact.telephone || 'Non renseigné';
              const waliText = target?.contact.nomCompletWali
                ? `${target.contact.nomCompletWali} (${target.contact.telephoneWali || 'Même numéro'})`
                : undefined;

              const messageText = buildOfficialContactReleaseMessage(
                releasingRequest,
                contactPhone,
                waliText
              );

              const cleanPhone = releasingRequest.demandeurWhatsApp.replace(/[^0-9]/g, '');
              const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

              return (
                <div className="space-y-4 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1">
                    <div className="font-bold text-emerald-950">
                      Coordonnées délivrées pour {releasingRequest.demandeurNom} :
                    </div>
                    <div>Profil : {releasingRequest.targetProfilePseudo}</div>
                    <div className="font-mono text-sm font-bold text-stone-900">
                      Numéro : {contactPhone}
                    </div>
                    {waliText && (
                      <div className="text-stone-700">
                        Tuteur légal (Wali) : <strong>{waliText}</strong>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Message officiel généré à transmettre au demandeur par WhatsApp :
                    </label>
                    <textarea
                      readOnly
                      rows={6}
                      value={messageText}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg font-mono text-[11px] text-stone-800"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(messageText);
                        setCopiedMessage(true);
                        setTimeout(() => setCopiedMessage(false), 2000);
                      }}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium transition-colors"
                    >
                      {copiedMessage ? '✓ Message copié !' : 'Copier le message'}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Envoyer par WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleConfirmRelease(releasingRequest.id)}
                        className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
                      >
                        Valider comme Transmis
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
