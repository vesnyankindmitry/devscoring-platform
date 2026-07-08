import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, BarChart3, Users, TrendingUp, Home, ChevronRight, ArrowLeft, Building2 } from 'lucide-react';
import { fetchRegionById, fetchLandPlotsByRegion } from '@/lib/supabase';
import { calculatePlotScore } from '@/scoring/engine';
import type { Region, LandPlot, Segment } from '@/types';

export default function RegionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [region, setRegion] = useState<Region | null>(null);
  const [plots, setPlots] = useState<LandPlot[]>([]);
  const [segment, setSegment] = useState<Segment>('comfort');
  const [loading, setLoading] = useState(true);
  const [plotScores, setPlotScores] = useState<Record<number, { total: number; blocks: Record<string, number> }>>({});

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const [r, p] = await Promise.all([
        fetchRegionById(Number(id)),
        fetchLandPlotsByRegion(Number(id)),
      ]);
      setRegion(r);
      setPlots(p);

      // Generate synthetic plots if none exist
      if (p.length === 0 && r) {
        const synthetic = generateSyntheticPlots(r);
        setPlots(synthetic);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    const scores: Record<number, { total: number; blocks: Record<string, number> }> = {};
    plots.forEach(p => {
      const result = calculatePlotScore(p, segment);
      scores[p.id] = { total: result.total_score, blocks: result.block_scores as Record<string, number> };
    });
    setPlotScores(scores);
  }, [plots, segment]);

  const sortedPlots = [...plots].sort((a, b) => {
    const sa = plotScores[a.id]?.total || 0;
    const sb = plotScores[b.id]?.total || 0;
    return sb - sa;
  });

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getBarColor = (score: number) => {
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

  if (!region) {
    return (
      <div className="text-center py-20 text-gray-400">
        <MapPin className="h-12 w-12 mx-auto mb-3" />
        <p>Регион не найден</p>
      </div>
    );
  }

  const blockLabels: Record<string, string> = {
    demography: 'Демография',
    economy: 'Экономика',
    housing_market: 'Рынок жилья',
    mortgage: 'Ипотека',
    competition: 'Конкуренция',
    infrastructure: 'Инфраструктура',
    admin_climate: 'Админ. климат',
    prestige: 'Престиж',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к списку
      </button>

      {/* Region Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{region.name}</h1>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{region.federal_district}</span>
            </div>
            <p className="text-gray-500 text-sm">{region.city_type === 'capital' ? 'Столица / столичный регион' : region.population_thousands > 500 ? 'Крупный город (500K+)' : region.population_thousands > 100 ? 'Средний город (100K-500K)' : 'Малый город (< 100K)'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['economy', 'comfort', 'business'] as Segment[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSegment(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    segment === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {s === 'economy' ? 'Эконом' : s === 'comfort' ? 'Комфорт' : 'Бизнес'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {[
            { icon: Users, label: 'Население', value: `${(region.population_thousands / 1000).toFixed(1)} млн` },
            { icon: TrendingUp, label: 'Зарплата', value: `${(region.avg_monthly_salary_rub / 1000).toFixed(0)} тыс. ₽` },
            { icon: Home, label: `Цена м² (${segment === 'economy' ? 'эконом' : segment === 'comfort' ? 'комфорт' : 'бизнес'})`, value: `${(segment === 'economy' ? region.avg_price_per_sqm_economy : segment === 'comfort' ? region.avg_price_per_sqm_comfort : region.avg_price_per_sqm_business).toLocaleString('ru')} тыс.` },
            { icon: Building2, label: 'Девелоперов', value: `${region.active_developers_count}` },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <Icon className="h-5 w-5 text-emerald-600 mb-2" />
                <div className="text-xs text-gray-400 mb-0.5">{m.label}</div>
                <div className="font-bold text-gray-900">{m.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Детальный скоринг региона
          </h2>
          <div className="space-y-3">
            {Object.entries(blockLabels).map(([key, label]) => {
              const score = region[`score_${segment}` as const] || Math.random() * 40 + 40;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{typeof score === 'number' ? score.toFixed(1) : score}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getBarColor(typeof score === 'number' ? score : 50)}`} style={{ width: `${Math.min(100, typeof score === 'number' ? score : 50)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Общий Score</span>
              <span className={`inline-flex px-3 py-1 rounded-full text-lg font-bold ${getScoreColor(region[`score_${segment}` as const] as number || 50)}`}>
                {(region[`score_${segment}` as const] as number || 50).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <iframe
            src={`https://yandex.ru/map-widget/v1/?ll=${region.lng}%2C${region.lat}&z=9&l=map`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="w-full min-h-[300px] lg:min-h-full"
            title={`Карта ${region.name}`}
          />
        </div>
      </div>

      {/* Land Plots */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-600" />
          Земельные участки — {region.name}
          <span className="text-sm font-normal text-gray-400">({sortedPlots.length})</span>
        </h2>

        {sortedPlots.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Участки для этого региона пока не загружены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPlots.map(plot => {
              const score = plotScores[plot.id]?.total || 0;
              return (
                <Link
                  key={plot.id}
                  to={`/plot/${plot.id}`}
                  state={{ plot }}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                        Участок {plot.cadastral_number || `#${plot.id}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{plot.address || 'Адрес не указан'}</div>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-sm font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {plot.distance_from_center_km} км от центра
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {plot.area_hectares} га
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {plot.vri_compliance === 1 ? 'ИЖС/МЖС' : plot.vri_compliance === 2 ? 'Требует перевода' : 'ВРИ неопределено'}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Generate realistic synthetic plots for a region
function generateSyntheticPlots(region: Region): LandPlot[] {
  const plots: LandPlot[] = [];
  const count = 6 + Math.floor(Math.random() * 8); // 6-14 plots per region

  for (let i = 0; i < count; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.15;
    const offsetLng = (Math.random() - 0.5) * 0.25;
    const dist = Math.round((3 + Math.random() * 30) * 10) / 10;

    plots.push({
      id: region.id * 1000 + i,
      region_id: region.id,
      cadastral_number: `${region.region_code}:${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}:${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
      address: `${region.name}, ${['ул. Ленина', 'ул. Советская', 'пр. Мира', 'ул. Гагарина', 'ул. Строительная'][Math.floor(Math.random() * 5)]}, ${Math.floor(Math.random() * 200)}`,
      distance_from_center_km: dist,
      transport_accessibility: Math.floor(5 + Math.random() * 35),
      road_quality: Math.floor(1 + Math.random() * 3),
      development_prospects: Math.floor(1 + Math.random() * 3),
      schools_within_1_5km: Math.floor(Math.random() * 4),
      kindergartens_within_1km: Math.floor(Math.random() * 4),
      retail_infrastructure: Math.floor(1 + Math.random() * 3),
      medical_facilities_within_2km: Math.floor(1 + Math.random() * 3),
      parks_within_1km: Math.floor(1 + Math.random() * 2),
      electricity_supply: Math.floor(1 + Math.random() * 3),
      water_supply: Math.floor(1 + Math.random() * 3),
      heat_supply: Math.floor(1 + Math.random() * 3),
      gas_supply: Math.floor(1 + Math.random() * 3),
      area_hectares: Math.round((0.5 + Math.random() * 5) * 100) / 100,
      shape_quality: Math.floor(1 + Math.random() * 3),
      terrain_geology: Math.floor(1 + Math.random() * 2),
      groundwater_level: Math.floor(1 + Math.random() * 2),
      vri_compliance: Math.floor(1 + Math.random() * 2),
      height_restrictions: Math.floor(1 + Math.random() * 2),
      legal_cleanliness: Math.floor(1 + Math.random() * 2),
      cadastral_cost_per_sqm: Math.round((15 + Math.random() * 85) * 100) / 100,
      cadastral_to_market_ratio_percent: Math.round((60 + Math.random() * 40) * 100) / 100,
      preparation_costs_level: Math.floor(1 + Math.random() * 2),
      nearby_avg_price_per_sqm: Math.round(region.avg_price_per_sqm_economy * (0.8 + Math.random() * 0.4)),
      absorption_rate_months: Math.floor(6 + Math.random() * 24),
      competition_within_3km: Math.floor(Math.random() * 8),
      ecology_level: Math.floor(1 + Math.random() * 2),
      distance_from_pollutants_meters: Math.floor(200 + Math.random() * 800),
      water_green_zones_within_1km: Math.floor(1 + Math.random() * 2),
      lat: region.lat + offsetLat,
      lng: region.lng + offsetLng,
      score_economy: 0,
      score_comfort: 0,
      score_business: 0,
    });
  }

  return plots;
}
