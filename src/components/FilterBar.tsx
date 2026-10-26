import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, NigerCity, Gender } from '../types/nikah';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
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
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalMatches,
}) => {
  const handleGenderChange = (val: 'TOUS' | Gender) => {
    setFilters((prev) => ({ ...prev, sexe: val }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, ville: e.target.value as any }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, situation: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      sexe: 'TOUS',
      ville: 'TOUTES',
      situation: 'TOUTES',
      ageMin: 18,
      ageMax: 65,
      searchQuery: '',
    });
  };

  const isFiltered =
    filters.sexe !== 'TOUS' ||
    filters.ville !== 'TOUTES' ||
    filters.situation !== 'TOUTES' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-sm p-4 sm:p-5 mb-8">
      {/* Search Input and Sexe Segmented Control */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search by keyword */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par profession, études, pseudo..."
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/30 focus:border-emerald-800 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Gender Segmented Control */}
        <div className="md:col-span-4 flex items-center bg-stone-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => handleGenderChange('TOUS')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filters.sexe === 'TOUS'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tous les profils
          </button>
          <button
            type="button"
            onClick={() => handleGenderChange('FEMME')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filters.sexe === 'FEMME'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sœurs (Femmes)
          </button>
          <button
            type="button"
            onClick={() => handleGenderChange('HOMME')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filters.sexe === 'HOMME'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Frères (Hommes)
          </button>
        </div>

        {/* City Filter */}
        <div className="md:col-span-3">
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <select
              value={filters.ville}
              onChange={handleCityChange}
              className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-800/30 text-stone-800 appearance-none cursor-pointer"
            >
              <option value="TOUTES">Toutes les villes au Niger</option>
              {NIGER_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value="Diaspora / Autre">Diaspora / Autre</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-stone-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Secondary filter row */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Situation :</span>
            <select
              value={filters.situation}
              onChange={handleStatusChange}
              className="py-1 px-2.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
            >
              <option value="TOUTES">Toutes situations</option>
              <option value="Célibataire">Célibataires</option>
              <option value="Divorcé(e)">Divorcé(e)s</option>
              <option value="Veuf / Veuve">Veufs / Veuves</option>
              <option value="Polygamie">Polygamie</option>
            </select>
          </div>

          <span className="text-stone-400">|</span>

          <span className="tabular-nums font-medium text-stone-900">
            {totalMatches} profil{totalMatches > 1 ? 's' : ''} disponible{totalMatches > 1 ? 's' : ''}
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors py-1 px-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        )}
      </div>
    </div>
  );
};
