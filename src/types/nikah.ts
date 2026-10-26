export type NigerCity =
  | 'Niamey'
  | 'Maradi'
  | 'Zinder'
  | 'Tahoua'
  | 'Agadez'
  | 'Tillabéri'
  | 'Dosso'
  | 'Diffa'
  | 'Diaspora / Autre';

export type Gender = 'HOMME' | 'FEMME';

export type MaritalStatus =
  | 'Célibataire (jamais marié)'
  | 'Divorcé(e)'
  | 'Veuf / Veuve'
  | 'Marié (recherche 2ème/3ème épouse)'
  | 'Polygamie acceptée';

export type ProfileStatus = 'EN_ATTENTE' | 'VALIDE' | 'SUSPECT' | 'REJETE';

export interface ConfidentialContact {
  telephone: string;
  whatsapp: string;
  nomCompletWali?: string; // Tuteur légal (Recommandé pour les sœurs selon la Sunnah)
  telephoneWali?: string;
  villeResidence?: string;
  remarquesConfidentielles?: string;
}

export interface Profile {
  id: string;
  codeId: string; // Ex: NK-227-018
  prenomPseudo: string;
  age: number;
  ville: NigerCity;
  sexe: Gender;
  situationMatrimoniale: MaritalStatus;
  rechercheSexe: Gender;
  rechercheAgeMin: number;
  rechercheAgeMax: number;
  presentation: string;
  profession: string;
  niveauEtudes: string;
  pratiqueReligieuse: string;
  projetFamille: string;
  photos: [string, string]; // 2 photos obligatoires
  contact: ConfidentialContact;
  status: ProfileStatus;
  adminNote?: string;
  isFeatured?: boolean;
  createdAt: string;
  verifiedAt?: string;
}

export type PaymentMethod = 'MYNITA' | 'AMANATA' | 'AIRTEL_MONEY' | 'MOOV_FLOOZ';

export type ContactRequestStatus =
  | 'EN_ATTENTE_VERIFICATION'
  | 'PAIEMENT_VALIDE'
  | 'CONTACT_TRANSMIS'
  | 'REFUSE';

export interface ContactRequest {
  id: string;
  requestCode: string; // Ex: DEM-2026-089
  targetProfileId: string;
  targetProfileCode: string;
  targetProfilePseudo: string;
  targetProfileCity: string;
  demandeurNom: string;
  demandeurAge: number;
  demandeurVille: NigerCity;
  demandeurProfession: string;
  demandeurTelephone: string;
  demandeurWhatsApp: string;
  demandeurMotif: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentProofUrl?: string; // image capture SMS MyNita ou AmanaTa
  feeAmountFcfa: number;
  status: ContactRequestStatus;
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
}

export interface AdminSettings {
  whatsappBusiness: string;
  myNitaDepositNumber: string;
  myNitaAccountName: string;
  amanaTaDepositNumber: string;
  amanaTaAccountName: string;
  contactFeeFcfa: number;
  adminPin: string;
  announcementNotice: string;
}

export interface FilterState {
  sexe: 'TOUS' | Gender;
  ville: 'TOUTES' | NigerCity;
  situation: 'TOUTES' | string;
  ageMin: number;
  ageMax: number;
  searchQuery: string;
}
