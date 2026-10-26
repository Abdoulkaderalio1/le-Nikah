import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Search,
  User as UserIcon,
  FileText,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  logout,
  getAccessToken,
  initAuth,
} from '../services/firebaseAuth';
import {
  getGmailUserProfile,
  listGmailMessages,
  getGmailMessageDetails,
  sendGmailMessage,
  GmailMessageSummary,
  GmailUserProfile,
} from '../services/gmailApi';

interface GmailNotificationCenterProps {
  onClose?: () => void;
  initialRecipientEmail?: string;
  initialSubject?: string;
  initialBody?: string;
}

export const GmailNotificationCenter: React.FC<GmailNotificationCenterProps> = ({
  onClose,
  initialRecipientEmail = '',
  initialSubject = '',
  initialBody = '',
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Gmail Data State
  const [gmailProfile, setGmailProfile] = useState<GmailUserProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Compose State
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [recipientEmail, setRecipientEmail] = useState<string>(initialRecipientEmail);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [bodyText, setBodyText] = useState<string>(initialBody);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string>('');
  const [sendErrorMessage, setSendErrorMessage] = useState<string>('');

  // Explicit User Confirmation Dialog for Destructive / Send Operation (MANDATORY REQUIREMENT)
  const [showSendConfirmation, setShowSendConfirmation] = useState<boolean>(false);

  // Initialize Auth State Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setCurrentUser(user);
        if (token) {
          setAccessToken(token);
          loadProfileAndMessages(token);
        }
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setGmailProfile(null);
        setMessages([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadProfileAndMessages = async (token: string, query: string = '') => {
    setIsLoadingMessages(true);
    setAuthError('');
    try {
      const profile = await getGmailUserProfile(token);
      setGmailProfile(profile);

      const listRes = await listGmailMessages(token, 8, query);
      if (listRes.messages && listRes.messages.length > 0) {
        const detailsPromises = listRes.messages.map((m) =>
          getGmailMessageDetails(token, m.id).catch(() => null)
        );
        const detailedList = (await Promise.all(detailsPromises)).filter(
          Boolean
        ) as GmailMessageSummary[];
        setMessages(detailedList);
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Erreur chargement Gmail:', err);
      setAuthError(err.message || 'Erreur lors de la communication avec Gmail.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        await loadProfileAndMessages(result.accessToken);
      }
    } catch (err: any) {
      console.error('Erreur connexion:', err);
      setAuthError(
        err.message || 'Impossible de se connecter avec Google. Veuillez réessayer.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setGmailProfile(null);
    setMessages([]);
  };

  const handleApplyTemplate = (type: 'approved' | 'contact_released' | 'payment_reminder') => {
    if (type === 'approved') {
      setSubject('Félicitations - Votre profil matrimonial a été validé | Chemin pour le Nikah');
      setBodyText(
        `Salam aleykoum wa rahmatoullah,\n\nNous avons le plaisir de vous informer que votre profil matrimonial sur la plateforme "Chemin pour le Nikah" a été vérifié et approuvé avec succès par l'administrateur.\n\nIl est désormais visible auprès des membres sérieux, dans le respect strict de la confidentialité de vos coordonnées.\n\nQu'Allah bénisse votre démarche vers un foyer pieux.\n\nL'équipe Chemin pour le Nikah\nContact officiel WhatsApp Business : +227 99 61 40 98`
      );
    } else if (type === 'contact_released') {
      setSubject('Mise en contact autorisée - Informations matrimoniales | Chemin pour le Nikah');
      setBodyText(
        `Salam aleykoum wa rahmatoullah,\n\nVotre demande de mise en contact a été validée suite à la vérification de votre paiement par transfert MyNita/AmanaTa.\n\nVous trouverez ci-après les coordonnées autorisées pour échanger dans le cadre honorable de la Sunnah et organiser la rencontre licite (Ro'ya char'iyya) en présence du tuteur (Wali).\n\nQu'Allah place la baraka dans cette union.\n\nL'administration Chemin pour le Nikah\nWhatsApp : +227 99 61 40 98`
      );
    } else if (type === 'payment_reminder') {
      setSubject('Instructions pour le règlement de vos frais de médiation | Chemin pour le Nikah');
      setBodyText(
        `Salam aleykoum wa rahmatoullah,\n\nSuite à votre intérêt pour un profil sur Chemin pour le Nikah, veuillez effectuer le transfert des frais de médiation (3 000 FCFA) par :\n- MyNita : 99 61 40 98\n- AmanaTa : 99 61 40 98\n\nPuis envoyez votre reçu ou capture d'écran sur notre WhatsApp Business : +227 99 61 40 98.\n\nFraternellement,\nChemin pour le Nikah`
      );
    }
  };

  const handleTriggerSendWithConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setSendErrorMessage('');
    setSendSuccessMessage('');

    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      setSendErrorMessage('Veuillez renseigner une adresse email valide.');
      return;
    }

    if (!subject.trim()) {
      setSendErrorMessage('Veuillez renseigner un objet.');
      return;
    }

    if (!bodyText.trim()) {
      setSendErrorMessage('Veuillez renseigner le corps du message.');
      return;
    }

    // Trigger explicit confirmation dialog before calling destructive/send API
    setShowSendConfirmation(true);
  };

  const handleExecuteSend = async () => {
    setShowSendConfirmation(false);
    if (!accessToken) {
      setSendErrorMessage('Veuillez vous reconnecter à votre compte Google Gmail.');
      return;
    }

    setIsSending(true);
    try {
      await sendGmailMessage(accessToken, recipientEmail, subject, bodyText);
      setSendSuccessMessage(`Email envoyé avec succès via Gmail à ${recipientEmail} !`);
      setRecipientEmail('');
      setSubject('');
      setBodyText('');
      // Refresh inbox
      loadProfileAndMessages(accessToken);
    } catch (err: any) {
      console.error("Erreur d'envoi:", err);
      setSendErrorMessage(err.message || "Erreur lors de l'envoi de l'email via Gmail.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden space-y-6 p-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shadow-sm">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Centre Gmail & Notifications Matrimoniales
              </h2>
              <span className="text-[11px] bg-red-100 text-red-800 font-medium px-2 py-0.5 rounded">
                Gmail API Officielle
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Gérez les échanges, confirmations MyNita/AmanaTa et notifications de Nikah directement via Gmail.
            </p>
          </div>
        </div>

        {/* Auth status block */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-1.5 text-xs">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Utilisateur'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-stone-500" />
              )}
              <div className="text-left">
                <span className="font-semibold text-stone-900 block leading-tight">
                  {currentUser.displayName || 'Compte Google'}
                </span>
                <span className="text-[11px] text-stone-500 block leading-tight">
                  {gmailProfile?.emailAddress || currentUser.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-stone-400 hover:text-stone-700 p-1 transition-colors"
                title="Se déconnecter de Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {authError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* When user is NOT authenticated, display Google Sign-In with official GSI styling */}
      {!currentUser && (
        <div className="py-12 text-center max-w-md mx-auto space-y-5">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Connectez votre compte Gmail
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Pour consulter vos emails reçus et envoyer des notifications officielles de mariage ou de paiement avec permission, connectez-vous avec votre compte Google.
            </p>
          </div>

          {/* Official Google Sign-In button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="flex items-center gap-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 px-5 py-2.5 rounded-lg shadow-sm font-medium text-xs transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoggingIn ? 'Connexion en cours...' : 'Se connecter avec Google'}</span>
            </button>
          </div>
        </div>
      )}

      {/* When user IS authenticated, show Gmail workspace */}
      {currentUser && (
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-stone-200">
            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`py-2 px-1 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'inbox'
                    ? 'border-red-600 text-stone-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Boîte de réception</span>
                {messages.length > 0 && (
                  <span className="bg-stone-100 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full tabular-nums">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('compose')}
                className={`py-2 px-1 flex items-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'compose'
                    ? 'border-red-600 text-stone-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Rédiger / Envoyer une notification</span>
              </button>
            </div>

            {activeTab === 'inbox' && (
              <button
                onClick={() => accessToken && loadProfileAndMessages(accessToken, searchQuery)}
                disabled={isLoadingMessages}
                className="text-stone-500 hover:text-stone-900 text-xs flex items-center gap-1 py-1"
                title="Actualiser la boîte Gmail"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-red-600' : ''}`}
                />
                <span>Actualiser</span>
              </button>
            )}
          </div>

          {/* TAB 1: INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Filtrer vos emails (ex : Nikah, MyNita, Amanata, nom...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && accessToken) {
                        loadProfileAndMessages(accessToken, searchQuery);
                      }
                    }}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
                <button
                  onClick={() => accessToken && loadProfileAndMessages(accessToken, searchQuery)}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium transition-colors"
                >
                  Filtrer
                </button>
              </div>

              {/* Messages list */}
              {isLoadingMessages ? (
                <div className="py-12 text-center text-xs text-stone-500 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
                  <div>Récupération des emails depuis Gmail...</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs space-y-1">
                  <Mail className="w-8 h-8 mx-auto text-stone-400" />
                  <div className="font-semibold text-stone-700">Aucun message trouvé</div>
                  <div>Aucun email ne correspond à votre recherche dans Gmail.</div>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className="p-3.5 hover:bg-stone-50 transition-colors cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-stone-500 text-[11px]">
                        <span className="font-semibold text-stone-900 truncate max-w-[250px]">
                          {msg.from}
                        </span>
                        <span className="tabular-nums">{msg.date}</span>
                      </div>
                      <div className="font-medium text-stone-800 line-clamp-1">{msg.subject}</div>
                      <div className="text-stone-500 line-clamp-2 leading-relaxed">{msg.snippet}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPOSE NOTIFICATION */}
          {activeTab === 'compose' && (
            <div className="space-y-4">
              {/* Notification templates */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Modèles de notifications officielles pour le Nikah :</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('approved')}
                    className="py-1 px-2.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-md text-[11px] text-stone-700 font-medium transition-colors"
                  >
                    Profil Validé & Publié
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('contact_released')}
                    className="py-1 px-2.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-md text-[11px] text-stone-700 font-medium transition-colors"
                  >
                    Mise en contact autorisée (Wali)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('payment_reminder')}
                    className="py-1 px-2.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-md text-[11px] text-stone-700 font-medium transition-colors"
                  >
                    Instructions MyNita / AmanaTa
                  </button>
                </div>
              </div>

              {sendSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{sendSuccessMessage}</span>
                </div>
              )}

              {sendErrorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sendErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleTriggerSendWithConfirmation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Destinataire (Email) *</label>
                  <input
                    type="email"
                    required
                    placeholder="candidat@domaine.com ou tuteur@domaine.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Objet du message *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Suivi de votre demande matrimoniale..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Corps du message *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Rédigez votre message officiel..."
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400">
                    Expédié depuis : {gmailProfile?.emailAddress || currentUser.email}
                  </span>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer via Gmail</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* MODAL : MESSAGE DETAIL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900 truncate pr-4">
                {selectedMessage.subject}
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-stone-600">
              <div>
                <strong>De : </strong> {selectedMessage.from}
              </div>
              {selectedMessage.to && (
                <div>
                  <strong>À : </strong> {selectedMessage.to}
                </div>
              )}
              <div>
                <strong>Date : </strong> {selectedMessage.date}
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {selectedMessage.snippet}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION DIALOG FOR SENDING EMAILS */}
      {showSendConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-800">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Confirmer l'envoi du message Gmail
                </h3>
                <p className="text-xs text-stone-500">
                  Cette action transmettra un email officiel depuis votre compte Google.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5 text-stone-700">
              <div>
                <span className="text-stone-400">Destinataire : </span>
                <strong className="text-stone-900">{recipientEmail}</strong>
              </div>
              <div>
                <span className="text-stone-400">Objet : </span>
                <span className="font-medium text-stone-900">{subject}</span>
              </div>
              <div className="pt-1 text-[11px] text-stone-500 line-clamp-3 italic">
                « {bodyText.substring(0, 140)}... »
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSendConfirmation(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleExecuteSend}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Confirmer et Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
