import React from 'react';
import { BookOpen, ShieldCheck, Heart, Users, CheckCircle, PhoneCall } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

export const CharterView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Charte d'Honneur & Éthique du Nikah
        </h1>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Nos engagements mutuels pour préserver la sainteté du mariage et la pudeur de nos sœurs et frères au Niger.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-stone-100 pb-4">
          <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            1. Intention sincère et exclusive pour le Nikah
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            « Chemin pour le Nikah » n'est en aucun cas un réseau de rencontre futile, de libertinage ou d'amitié informelle. Tout membre s'engage devant Allah à n'utiliser cette plateforme que dans l'unique but de contracter un mariage islamique valide (Nikah).
          </p>
        </div>

        <div className="border-b border-stone-100 pb-4">
          <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            2. Véracité absolue des informations & Décence des photos
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Les deux photos fournies lors de l'inscription doivent respecter scrupuleusement la pudeur islamique (visage naturel et digne, vêtements amples et convenables). Tout propos mensonger sur l'âge, la situation matrimoniale ou la profession entraîne la suppression immédiate et définitive du profil.
          </p>
        </div>

        <div className="border-b border-stone-100 pb-4">
          <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            3. Rôle du tuteur légal (Wali) et respect de la famille
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Pour les sœurs, le contact du tuteur (père, oncle ou frère aîné) est privilégié dans la démarche de mise en relation dès que l'intérêt mutuel est établi. Les rencontres physiques doivent s'effectuer en présence d'un mahram (Ro’ya char’iyya), conformément aux enseignements du Prophète Muhammad (saw).
          </p>
        </div>

        <div className="border-b border-stone-100 pb-4">
          <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-800" />
            4. Protection des coordonnées personnelles
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Pour éviter le harcèlement et les spams, les numéros personnels ne sont pas publics. La modération humaine vérifie chaque paiement de frais de mise en contact avant d'autoriser l'échange d'informations.
          </p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-emerald-800" />
            <span>Assistance et signalement officiel :</span>
          </div>
          <p>
            Pour toute question déontologique ou pour signaler un comportement suspect, contactez notre WhatsApp Business officiel au <strong className="font-mono">{OFFICIAL_WHATSAPP_NUMBER}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
