import {
  Profile,
  ContactRequest,
  AdminSettings,
} from '../types/nikah';
import {
  INITIAL_PROFILES,
  INITIAL_CONTACT_REQUESTS,
  DEFAULT_ADMIN_SETTINGS,
} from '../data/initialData';

const PROFILES_KEY = 'chemin_nikah_profiles_v1';
const REQUESTS_KEY = 'chemin_nikah_requests_v1';
const SETTINGS_KEY = 'chemin_nikah_settings_v1';

export function getStoredProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading profiles from localStorage', e);
    return INITIAL_PROFILES;
  }
}

export function saveStoredProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles to localStorage', e);
  }
}

export function getStoredContactRequests(): ContactRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_CONTACT_REQUESTS));
      return INITIAL_CONTACT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading contact requests from localStorage', e);
    return INITIAL_CONTACT_REQUESTS;
  }
}

export function saveStoredContactRequests(requests: ContactRequest[]): void {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving contact requests to localStorage', e);
  }
}

export function getStoredAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
      return DEFAULT_ADMIN_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading admin settings from localStorage', e);
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveStoredAdminSettings(settings: AdminSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving admin settings to localStorage', e);
  }
}

export function resetDemoData(): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(INITIAL_CONTACT_REQUESTS));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
}
