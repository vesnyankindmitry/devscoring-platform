import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, BarChart3, Home, Zap, Ruler, Shield, DollarSign, TrendingUp, TreePine } from 'lucide-react';
import { fetchLandPlotById } from '@/lib/supabase';
import { calculatePlotScore } from '@/scoring/engine';
import type { LandPlot, Segment } from '@/types';

export default function PlotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plot, setPlot] = useState<LandPlot | null>(null);
  const [segment, setSegment] = useState<Segment>('comfort');
  const [loading, setLoading] = useState(true);
  const [scoreResult, setScoreResult] = useState<ReturnType<typeof calculatePlotScore> | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const data = await fetchLandPlotById(Number(id));
      setPlot(data);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (plot) {
      setScoreResult(calculatePlotScore(plot, segment));
    }
  }, [plot, segment]);

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

  if (!plot) {
    return (
      <div className="text-center py-20 text-gray-400">
        <MapPin className="h-12 w-12 mx-auto mb-3" />
        <p>Участок не найден</p>
      </div>
    );
  }

  const blockData = [
    { key: 'location', label: 'Локация', icon: MapPin, items: [
      { label: 'От центра', value: `${plot.distance_from_center_km} км` },
      { label: 'Транспорт', value: `${plot.transport_accessibility} мин` },
      { label: 'Дороги', value: ['Асфальт 2+ полосы', 'Асфальт 1-2 полосы', 'Грунтовка', 'Нет дороги'][plot.road_quality - 1] },
      { label: 'Перспективы', value: ['Высокие', 'Средние', 'Низкие', 'Нет'][plot.development_prospects - 1] },
    ]},
    { key: 'infrastructure', label: 'Инфраструктура', icon: Home, items: [
      { label: 'Школы (1.5 км)', value: `${plot.schools_within_1_5km}` },
      { label: 'Садики (1 км)', value: `${plot.kindergartens_within_1km}` },
      { label: 'Торговля', value: ['Развитая', 'Удовл.', 'Слабая', 'Нет'][plot.retail_infrastructure - 1] },
      { label: 'Медицина', value: ['Поликл.+апт.', 'Поликлиника', 'Аптеки', 'Нет'][plot.medical_facilities_within_2km - 1] },
      { label: 'Парки', value: ['Есть', 'Зелёная зона', 'Нет'][plot.parks_within_1km - 1] },
    ]},
    { key: 'engineering', label: 'Инженерия', icon: Zap, items: [
      { label: 'Электричество', value: ['На границе', '< 300 м', '300-800 м', '> 800 м'][plot.electricity_supply - 1] },
      { label: 'Водоснабжение', value: ['Центр. на границе', '< 300 м', '300-800 м', '> 800 м'][plot.water_supply - 1] },
      { label: 'Теплоснабжение', value: ['Центр. на границе', '< 500 м', 'ИТП/автоном', '> 500 м'][plot.heat_supply - 1] },
      { label: 'Газ', value: ['На границе', '< 500 м', 'Нет'][plot.gas_supply - 1] },
    ]},
    { key: 'physical', label: 'Физ. характеристики', icon: Ruler, items: [
      { label: 'Площадь', value: `${plot.area_hectares} га` },
      { label: 'Форма', value: ['Прямоуг.', 'Близкая к прям.', 'Сложная', 'Выгнутая'][plot.shape_quality - 1] },
      { label: 'Рельеф', value: ['Ровный', 'Незн. работы', 'Сложные', 'Болото'][plot.terrain_geology - 1] },
      { label: 'Грунтовые воды', value: ['Низкий (>5м)', 'Средний (3-5м)', 'Высокий (<3м)'][plot.groundwater_level - 1] },
    ]},
    { key: 'legal', label: 'Юридические', icon: Shield, items: [
      { label: 'ВРИ', value: ['ИЖС/МЖС', 'Требует перевода', 'Неопределено'][plot.vri_compliance - 1] },
      { label: 'Высотность', value: ['Нет огранич.', 'Частичные', 'Значительные', 'Критичные'][plot.height_restrictions - 1] },
      { label: 'Юр. чистота', value: ['Чистый', 'Несущественные', 'Значимые', 'Арест'][plot.legal_cleanliness - 1] },
    ]},
    { key: 'financial', label: 'Финансовые', icon: DollarSign, items: [
      { label: 'Кадастр. стоимость', value: `${plot.cadastral_cost_per_sqm.toLocaleString('ru')} ₽/м²` },
      { label: 'Кад./рынок', value: `${plot.cadastral_to_market_ratio_percent.toFixed(0)}%` },
      { label: 'Подготовка', value: ['Низкие', 'Средние', 'Высокие', 'Критичные'][plot.preparation_costs_level - 1] },
    ]},
    { key: 'market', label: 'Рыночные', icon: TrendingUp, items: [
      { label: 'Цена рядом', value: `${plot.nearby_avg_price_per_sqm.toLocaleString('ru')} тыс. ₽/м²` },
      { label: 'Поглощение', value: `${plot.absorption_rate_months} мес.` },
      { label: 'Конкуренция', value: `${plot.competition_within_3km} проектов` },
    ]},
    { key: 'ecology', label: 'Экология', icon: TreePine, items: [
      { label: 'Экология', value: ['Хорошая', 'Удовл.', 'Неблагоприят.', 'Загрязнённая'][plot.ecology_level - 1] },
      { label: 'От промзон', value: `${plot.distance_from_pollutants_meters} м` },
      { label: 'Вода/зелень', value: ['Есть', 'Запланированы', 'Нет'][plot.water_green_zones_within_1km - 1] },
    ]},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-6 w-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Участок {plot.cadastral_number}</h1>
            </div>
            <p className="text-gray-500 text-sm">{plot.address}</p>
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
            {scoreResult && (
              <span className={`inline-flex px-4 py-2 rounded-xl text-xl font-bold ${getScoreColor(scoreResult.total_score)}`}>
                {scoreResult.total_score.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Breakdown */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Детальный скоринг участка
            </h2>
            {scoreResult && blockData.map(block => {
              const blockScore = (scoreResult.block_scores as Record<string, number>)[block.key] || 0;
              return (
                <div key={block.key} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <block.icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{block.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{blockScore.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${getBarColor(blockScore)}`} style={{ width: `${Math.min(100, blockScore * 10)}%` }} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                    {block.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-gray-700 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <iframe
              src={`https://yandex.ru/map-widget/v1/?ll=${plot.lng}%2C${plot.lat}&z=14&l=map&pt=${plot.lng},${plot.lat},pm2rdm`}
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              className="w-full"
              title={`Участок ${plot.cadastral_number}`}
            />
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Ключевые параметры</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Площадь', value: `${plot.area_hectares} га`, icon: Ruler },
                { label: 'До центра', value: `${plot.distance_from_center_km} км`, icon: MapPin },
                { label: 'Транспорт', value: `${plot.transport_accessibility} мин`, icon: Zap },
                { label: 'Поглощение', value: `${plot.absorption_rate_months} мес.`, icon: TrendingUp },
                { label: 'Конкуренция', value: `${plot.competition_within_3km} проектов`, icon: Home },
                { label: 'Цена рядом', value: `${plot.nearby_avg_price_per_sqm.toLocaleString('ru')} тыс.`, icon: DollarSign },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <Icon className="h-4 w-4 text-emerald-600" />
                    <div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm font-medium text-gray-900">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
