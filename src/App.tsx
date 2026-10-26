/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { ContactRequestModal } from './components/ContactRequestModal';
import { AdminDashboard } from './components/AdminDashboard';
import { HowItWorks } from './components/HowItWorks';
import { CharterView } from './components/CharterView';
import { GmailNotificationCenter } from './components/GmailNotificationCenter';
import { Footer } from './components/Footer';

import {
  Profile,
  ContactRequest,
  AdminSettings,
  FilterState,
} from './types/nikah';
import {
  getStoredProfiles,
  saveStoredProfiles,
  getStoredContactRequests,
  saveStoredContactRequests,
  getStoredAdminSettings,
  saveStoredAdminSettings,
  resetDemoData,
} from './utils/storage';
import { Shield, Sparkles, CheckCircle, HeartHandshake } from 'lucide-react';

export default function App() {
  // Persistent State
  const [profiles, setProfiles] = useState<Profile[]>(() => getStoredProfiles());
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>(() =>
    getStoredContactRequests()
  );
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() =>
    getStoredAdminSettings()
  );

  // Sync to storage
  useEffect(() => {
    saveStoredProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveStoredContactRequests(contactRequests);
  }, [contactRequests]);

  useEffect(() => {
    saveStoredAdminSettings(adminSettings);
  }, [adminSettings]);

  // Views & Modals
  const [activeView, setActiveView] = useState<'home' | 'howItWorks' | 'charter' | 'gmail' | 'admin'>('home');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedProfileForDetails, setSelectedProfileForDetails] = useState<Profile | null>(null);
  const [selectedProfileForContact, setSelectedProfileForContact] = useState<Profile | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    sexe: 'TOUS',
    ville: 'TOUTES',
    situation: 'TOUTES',
    ageMin: 18,
    ageMax: 65,
    searchQuery: '',
  });

  // Filtered Validated Profiles
  const validatedProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (p.status !== 'VALIDE') return false;

      // Filter Sexe
      if (filters.sexe !== 'TOUS' && p.sexe !== filters.sexe) return false;

      // Filter Ville
      if (filters.ville !== 'TOUTES' && p.ville !== filters.ville) return false;

      // Filter Situation
      if (filters.situation !== 'TOUTES' && !p.situationMatrimoniale.includes(filters.situation)) {
        return false;
      }

      // Filter Keyword
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.prenomPseudo.toLowerCase().includes(query);
        const matchesCity = p.ville.toLowerCase().includes(query);
        const matchesProf = p.profession.toLowerCase().includes(query);
        const matchesBio = p.presentation.toLowerCase().includes(query);
        const matchesCode = p.codeId.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesProf && !matchesBio && !matchesCode) {
          return false;
        }
      }

      return true;
    });
  }, [profiles, filters]);

  // Counts for Badges
  const pendingProfilesCount = profiles.filter((p) => p.status === 'EN_ATTENTE').length;
  const pendingRequestsCount = contactRequests.filter(
    (r) => r.status === 'EN_ATTENTE_VERIFICATION'
  ).length;

  // Handlers
  const handleAddNewProfile = (newProfile: Profile) => {
    const updated = [newProfile, ...profiles];
    setProfiles(updated);
  };

  const handleAddNewContactRequest = (newRequest: ContactRequest) => {
    const updated = [newRequest, ...contactRequests];
    setContactRequests(updated);
  };

  const handleResetDemoData = () => {
    resetDemoData();
    setProfiles(getStoredProfiles());
    setContactRequests(getStoredContactRequests());
    setAdminSettings(getStoredAdminSettings());
  };

  const scrollToProfiles = () => {
    setActiveView('home');
    const el = document.getElementById('profiles-directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col selection:bg-emerald-800 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950 text-amber-100 text-[11px] py-1.5 px-4 text-center border-b border-emerald-900 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>
          Plateforme dédiée au mariage islamique légitime au Niger · Frais MyNita & AmanaTa · Suivi officiel WhatsApp Business : +227 99 61 40 98
        </span>
      </div>

      {/* Main Header adhering to Top Bar contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenRegister={() => setIsRegisterOpen(true)}
        pendingCount={pendingProfilesCount}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero
              onRegisterClick={() => setIsRegisterOpen(true)}
              onExploreClick={scrollToProfiles}
              totalVerifiedProfiles={validatedProfiles.length}
            />

            {/* Profiles Directory Section */}
            <section
              id="profiles-directory"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    Profils Célibataires & Démarches Validées
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Profils modérés avec 2 photos vérifiées. Coordonnées protégées jusqu'à mise en relation.
                  </p>
                </div>

                <div className="text-xs text-stone-500 font-medium">
                  {validatedProfiles.length} profil{validatedProfiles.length > 1 ? 's' : ''} disponible{validatedProfiles.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Filters Bar */}
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                totalMatches={validatedProfiles.length}
              />

              {/* Profiles Grid */}
              {validatedProfiles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-3">
                  <Shield className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="font-serif font-bold text-stone-800 text-lg">
                    Aucun profil ne correspond à vos filtres
                  </h3>
                  <p className="text-xs text-stone-500">
                    Essayez d'élargir votre recherche ou de réinitialiser les filtres pour voir les autres profils vérifiés.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        sexe: 'TOUS',
                        ville: 'TOUTES',
                        situation: 'TOUTES',
                        ageMin: 18,
                        ageMax: 65,
                        searchQuery: '',
                      })
                    }
                    className="text-xs text-emerald-900 font-semibold underline pt-2"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validatedProfiles.map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      onViewDetails={(p) => setSelectedProfileForDetails(p)}
                      onRequestContact={(p) => setSelectedProfileForContact(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeView === 'howItWorks' && (
          <HowItWorks
            onRegisterClick={() => setIsRegisterOpen(true)}
            onExploreClick={scrollToProfiles}
            contactFeeFcfa={adminSettings.contactFeeFcfa}
          />
        )}

        {activeView === 'charter' && <CharterView />}

        {activeView === 'gmail' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <GmailNotificationCenter />
          </div>
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            profiles={profiles}
            contactRequests={contactRequests}
            adminSettings={adminSettings}
            onUpdateProfiles={setProfiles}
            onUpdateContactRequests={setContactRequests}
            onUpdateAdminSettings={setAdminSettings}
            onResetData={handleResetDemoData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={setActiveView}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        profile={selectedProfileForDetails}
        onClose={() => setSelectedProfileForDetails(null)}
        onRequestContact={(p) => setSelectedProfileForContact(p)}
      />

      {/* Contact Request & Payment Modal (MyNita / Amanata) */}
      <ContactRequestModal
        profile={selectedProfileForContact}
        adminSettings={adminSettings}
        onClose={() => setSelectedProfileForContact(null)}
        onSubmitRequest={handleAddNewContactRequest}
      />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmitProfile={handleAddNewProfile}
      />
    </div>
  );
}
