import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, BarChart3, Search, X, ChevronRight } from 'lucide-react';
import { fetchRegions } from '@/lib/supabase';
import type { Region, Segment } from '@/types';

export default function MapPage() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [segment, setSegment] = useState<Segment>('comfort');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [showPanel, setShowPanel] = useState(true);

  useEffect(() => {
    fetchRegions().then(setRegions);
  }, []);

  const filtered = useMemo(() => {
    return regions.filter(r => {
      const score = r[`score_${segment}` as const] || 0;
      if (score < minScore) return false;
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }).sort((a, b) => (b[`score_${segment}` as const] || 0) - (a[`score_${segment}` as const] || 0));
  }, [regions, segment, minScore, searchQuery]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#059669';
    if (score >= 50) return '#d97706';
    return '#dc2626';
  };

  const mapUrl = selectedRegion
    ? `https://yandex.ru/map-widget/v1/?ll=${selectedRegion.lng}%2C${selectedRegion.lat}&z=10&l=map`
    : `https://yandex.ru/map-widget/v1/?ll=65.0%2C55.0&z=4&l=map`;

  return (
    <div className="flex h-[calc(100vh-64px-64px)]">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${showPanel ? 'w-96' : 'w-0 overflow-hidden'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Map className="h-5 w-5 text-emerald-600" />
              Регионы на карте
            </h2>
            <button onClick={() => setShowPanel(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Segment selector */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
            {(['economy', 'comfort', 'business'] as Segment[]).map(s => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className={`flex-1 py-1 rounded-md text-xs font-medium transition-all ${
                  segment === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                {s === 'economy' ? 'Эконом' : s === 'comfort' ? 'Комфорт' : 'Бизнес'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск региона..."
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Min score filter */}
          <div>
            <label className="text-xs text-gray-500">Мин. Score: {minScore}</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1"
            />
          </div>
        </div>

        {/* Region list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(r => {
            const score = r[`score_${segment}` as const] || 0;
            const isActive = selectedRegion?.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-emerald-50/50 transition-colors ${
                  isActive ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.federal_district}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: getScoreColor(score) }}>
                      {score.toFixed(1)}
                    </span>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{(r.population_thousands / 1000).toFixed(1)} млн чел.</span>
                  <span>{(r.avg_monthly_salary_rub / 1000).toFixed(0)} тыс. ₽</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected region detail */}
        {selectedRegion && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedRegion.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-white rounded-lg p-2">
                <div className="text-gray-400">Score ({segment})</div>
                <div className="font-bold text-lg" style={{ color: getScoreColor(selectedRegion[`score_${segment}` as const] || 0) }}>
                  {(selectedRegion[`score_${segment}` as const] || 0).toFixed(1)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-gray-400">Население</div>
                <div className="font-bold text-gray-900">{(selectedRegion.population_thousands / 1000).toFixed(1)} млн</div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/region/${selectedRegion.id}`)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Подробнее об регионе
            </button>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {!showPanel && (
          <button
            onClick={() => setShowPanel(true)}
            className="absolute top-4 left-4 z-10 bg-white shadow-md rounded-lg p-2 hover:bg-gray-50"
          >
            <BarChart3 className="h-5 w-5 text-gray-600" />
          </button>
        )}
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
          title="Карта регионов"
        />
      </div>
    </div>
  );
}
