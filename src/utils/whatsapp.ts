import { ContactRequest } from '../types/nikah';

export const OFFICIAL_WHATSAPP_NUMBER = '+227 99 61 40 98';
export const OFFICIAL_WHATSAPP_RAW = '22799614098';

export function getCleanPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

export function buildPaymentProofWhatsAppLink(
  request: ContactRequest,
  businessNumber: string = OFFICIAL_WHATSAPP_RAW
): string {
  const cleanNumber = getCleanPhoneForWhatsApp(businessNumber) || OFFICIAL_WHATSAPP_RAW;

  const lines = [
    `*ASSALAMOU ALEYKOUM - PREUVE DE PAIEMENT NIKAH*`,
    `----------------------------------------`,
    `*Réf Demande :* ${request.requestCode}`,
    `*Profil ciblé :* ${request.targetProfilePseudo} (${request.targetProfileCode})`,
    `*Demandeur :* ${request.demandeurNom}`,
    `*Ville :* ${request.demandeurVille}`,
    `*Téléphone :* ${request.demandeurTelephone}`,
    `*Mode :* ${request.paymentMethod}`,
    `*Réf Transaction / SMS :* ${request.paymentReference || 'Voir capture ci-jointe'}`,
    `*Montant :* ${request.feeAmountFcfa.toLocaleString()} FCFA`,
    `----------------------------------------`,
    `_Je joins ci-dessous la capture d'écran / reçu de mon transfert MyNita ou AmanaTa pour vérification et mise en relation légitime._`,
  ];

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

export function buildOfficialContactReleaseMessage(
  request: ContactRequest,
  targetContactPhone: string,
  targetWaliInfo?: string
): string {
  const lines = [
    `*AUTORISATION OFFICIELLE DE MISE EN RELATION - CHEMIN POUR LE NIKAH*`,
    `Salam aleykoum wa rahmatoullah frère / sœur ${request.demandeurNom},`,
    `Votre paiement (${request.paymentMethod} - ${request.requestCode}) a été vérifié et approuvé avec succès par l'administration.`,
    ``,
    `*Coordonnées vérifiées pour la démarche matrimoniale :*`,
    `• Profil : ${request.targetProfilePseudo}`,
    `• Numéro direct / WhatsApp : ${targetContactPhone}`,
    targetWaliInfo ? `• Tuteur légal (Wali) : ${targetWaliInfo}` : '',
    ``,
    `*Rappel éthique :* Les échanges doivent impérativement demeurer chastes, respectueux et orientés exclusivement vers la concrétisation du Nikah selon la Sunnah.`,
    `Qu'Allah bénisse vos démarches.`,
  ].filter(Boolean);

  return lines.join('\n');
}
