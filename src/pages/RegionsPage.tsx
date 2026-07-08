import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Users, DollarSign, Home, ArrowUpDown, ChevronRight, Star, Search } from 'lucide-react';
import { fetchRegions } from '@/lib/supabase';
import { rankRegions } from '@/scoring/engine';
import type { Region, Segment, ScoringResult, BriefData } from '@/types';

export default function RegionsPage() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [segment, setSegment] = useState<Segment>('comfort');
  const [sortBy, setSortBy] = useState<'score' | 'match' | 'population' | 'salary'>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchRegions();
      setRegions(data);
      const saved = localStorage.getItem('devscoring_brief');
      if (saved) {
        const b = JSON.parse(saved) as BriefData;
        setBrief(b);
        setSegment(b.target_segment);
      }
      setLoading(false);
    };
    load();
  }, []);

  const results = useMemo<ScoringResult[]>(() => {
    if (!brief) {
      return regions.map(r => ({
        region_id: r.id,
        region_name: r.name,
        segment,
        total_score: r[`score_${segment}` as const] || 0,
        match_score: 0,
        block_scores: { demography: 0, economy: 0, housing_market: 0, mortgage: 0, competition: 0, infrastructure: 0, admin_climate: 0, prestige: 0 },
        region: r,
      }));
    }
    return rankRegions(regions, { ...brief, target_segment: segment });
  }, [regions, brief, segment]);

  const filtered = useMemo(() => {
    let data = results;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r => r.region_name.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'score': return [...data].sort((a, b) => b.total_score - a.total_score);
      case 'match': return [...data].sort((a, b) => b.match_score - a.match_score);
      case 'population': return [...data].sort((a, b) => b.region.population_thousands - a.region.population_thousands);
      case 'salary': return [...data].sort((a, b) => b.region.avg_monthly_salary_rub - a.region.avg_monthly_salary_rub);
      default: return data;
    }
  }, [results, searchQuery, sortBy]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBar = (score: number) => {
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            Рейтинг регионов
          </h1>
          {brief && (
            <p className="text-sm text-gray-500 mt-1">
              Персонализированный подбор для {brief.company_name || 'вашей компании'}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Segment selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['economy', 'comfort', 'business'] as Segment[]).map(s => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  segment === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s === 'economy' ? 'Эконом' : s === 'comfort' ? 'Комфорт' : 'Бизнес'}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              <option value="score">По скорингу</option>
              <option value="match">По мэтчу</option>
              <option value="population">По населению</option>
              <option value="salary">По зарплате</option>
            </select>
            <ArrowUpDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию региона..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
        />
      </div>

      {!brief && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">Бриф не заполнен</p>
              <p className="text-xs text-amber-700">Заполните бриф для персонализированного подбора регионов</p>
            </div>
          </div>
          <Link
            to="/brief"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Заполнить бриф
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Regions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Регион</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1"><Star className="h-3 w-3" />Score</div>
                </th>
                {brief && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Мэтч</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1"><Users className="h-3 w-3" />Население</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" />Зарплата</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1"><Home className="h-3 w-3" />Цена м²</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Округ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((result, idx) => {
                const r = result.region;
                const price = segment === 'economy' ? r.avg_price_per_sqm_economy : segment === 'comfort' ? r.avg_price_per_sqm_comfort : r.avg_price_per_sqm_business;
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/region/${r.id}`)}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        idx < 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.federal_district}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-sm font-bold ${getScoreColor(result.total_score)}`}>
                          {result.total_score.toFixed(1)}
                        </span>
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                          <div className={`h-full rounded-full ${getScoreBar(result.total_score)}`} style={{ width: `${Math.min(100, result.total_score)}%` }} />
                        </div>
                      </div>
                    </td>
                    {brief && (
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${result.match_score >= 60 ? 'text-emerald-600' : result.match_score >= 40 ? 'text-amber-600' : 'text-gray-400'}`}>
                          {result.match_score.toFixed(0)}%
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(r.population_thousands / 1000).toFixed(1)} млн
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(r.avg_monthly_salary_rub / 1000).toFixed(0)} тыс. ₽
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {price.toLocaleString('ru')} тыс.
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{r.federal_district}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">Ничего не найдено</p>
          <p className="text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}
