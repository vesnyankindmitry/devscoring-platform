import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, ChevronLeft, Building2, MapPin, Hammer, Home, TrendingUp, Check } from 'lucide-react';
import { supabase, fetchRegions } from '@/lib/supabase';
import type { Region, Segment } from '@/types';

interface BriefForm {
  company_name: string;
  contact_email: string;
  current_regions: number[];
  home_region_id: number | null;
  management_center_region_id: number | null;
  construction_type: string;
  building_type: string;
  floors_count: string;
  target_segment: Segment;
  max_distance_from_home_km: number;
  preferred_districts: string[];
  min_population: number;
}

const initialForm: BriefForm = {
  company_name: '',
  contact_email: '',
  current_regions: [],
  home_region_id: null,
  management_center_region_id: null,
  construction_type: 'monolith',
  building_type: 'apartment',
  floors_count: 'mid',
  target_segment: 'comfort',
  max_distance_from_home_km: 1000,
  preferred_districts: [],
  min_population: 100,
};

const FEDERAL_DISTRICTS = [
  'Центральный',
  'Северо-Западный',
  'Южный',
  'Северо-Кавказский',
  'Приволжский',
  'Уральский',
  'Сибирский',
  'Дальневосточный',
];

export default function BriefPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BriefForm>(initialForm);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegions().then(setRegions);
  }, []);

  const update = (field: keyof BriefForm, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const toggleDistrict = (d: string) => {
    setForm(prev => ({
      ...prev,
      preferred_districts: prev.preferred_districts.includes(d)
        ? prev.preferred_districts.filter(x => x !== d)
        : [...prev.preferred_districts, d],
    }));
  };

  const toggleCurrentRegion = (id: number) => {
    setForm(prev => ({
      ...prev,
      current_regions: prev.current_regions.includes(id)
        ? prev.current_regions.filter(x => x !== id)
        : [...prev.current_regions, id],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('brief_responses').insert({
        company_name: form.company_name,
        contact_email: form.contact_email,
        current_regions: form.current_regions,
        home_region_id: form.home_region_id,
        management_center_region_id: form.management_center_region_id,
        construction_type: form.construction_type,
        building_type: form.building_type,
        floors_count: form.floors_count,
        target_segment: form.target_segment,
        max_distance_from_home_km: form.max_distance_from_home_km,
        preferred_districts: form.preferred_districts,
        min_population: form.min_population,
      });
      if (error) throw error;

      const briefData = {
        company_name: form.company_name,
        contact_email: form.contact_email,
        current_regions: form.current_regions,
        home_region_id: form.home_region_id,
        management_center_region_id: form.management_center_region_id,
        construction_type: form.construction_type,
        building_type: form.building_type,
        floors_count: form.floors_count,
        target_segment: form.target_segment,
        max_distance_from_home_km: form.max_distance_from_home_km,
        preferred_districts: form.preferred_districts,
        min_population: form.min_population,
      };

      localStorage.setItem('devscoring_brief', JSON.stringify(briefData));
      navigate('/regions');
    } catch (e) {
      console.error(e);
      alert('Ошибка сохранения. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map(s => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            s === step ? 'bg-emerald-600 text-white' : s < step ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
          }`}>
            {s < step ? <Check className="h-4 w-4" /> : s}
          </div>
          {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
          <FileText className="h-4 w-4" />
          Бриф на экспансию
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Заполните бриф для подбора регионов</h1>
        <p className="text-gray-500 mt-2">Ответьте на вопросы — алгоритм подберёт лучшие регионы для вашей стратегии</p>
      </div>

      <StepIndicator />

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {/* Step 1: Company Profile */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Профиль компании
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название компании</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={e => update('company_name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="ООО Девелопер"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email для связи</label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={e => update('contact_email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="email@company.ru"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Домашний регион</label>
              <select
                value={form.home_region_id || ''}
                onChange={e => update('home_region_id', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              >
                <option value="">Выберите регион</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Центр стратегического управления</label>
              <select
                value={form.management_center_region_id || ''}
                onChange={e => update('management_center_region_id', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              >
                <option value="">Выберите регион</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Текущие регионы присутствия</label>
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                {regions.map(r => (
                  <label key={r.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.current_regions.includes(r.id)}
                      onChange={() => toggleCurrentRegion(r.id)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm">{r.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Product */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Hammer className="h-5 w-5 text-emerald-600" />
              Продукт и технология
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Технология строительства</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'monolith', label: 'Монолит', desc: 'Ж/б каркас' },
                  { value: 'brick', label: 'Кирпич', desc: 'Кирпичная кладка' },
                  { value: 'panel', label: 'Панель', desc: 'Панельное' },
                  { value: 'mixed', label: 'Смешанная', desc: 'Комбинированная' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('construction_type', opt.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.construction_type === opt.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип продукта</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'apartment', label: 'Многоквартирный дом' },
                  { value: 'izhs', label: 'ИЖС / Таунхаусы' },
                  { value: 'mixed', label: 'Смешанный' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('building_type', opt.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.building_type === opt.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Home className="h-5 w-5 mx-auto mb-1" />
                    <div className="font-medium text-sm">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Этажность проектов</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'low', label: '1–5 этажей', desc: 'Малоэтажное' },
                  { value: 'mid', label: '5–9 этажей', desc: 'Среднеэтажное' },
                  { value: 'high', label: '9–17 этажей', desc: 'Многоэтажное' },
                  { value: 'sky', label: '17+ этажей', desc: 'Высотное' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('floors_count', opt.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.floors_count === opt.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Целевой сегмент</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'economy', label: 'Эконом', desc: 'До 120 тыс./м²', color: 'border-emerald-500' },
                  { value: 'comfort', label: 'Комфорт', desc: '120–180 тыс./м²', color: 'border-blue-500' },
                  { value: 'business', label: 'Бизнес', desc: '180+ тыс./м²', color: 'border-amber-500' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => update('target_segment', opt.value as Segment)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      form.target_segment === opt.value
                        ? `${opt.color} bg-gray-50`
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Предпочтения по экспансии
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Предпочтительные федеральные округа</label>
              <div className="flex flex-wrap gap-2">
                {FEDERAL_DISTRICTS.map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDistrict(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.preferred_districts.includes(d)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Минимальное население города: <span className="text-emerald-600 font-bold">{form.min_population.toLocaleString('ru')} тыс.</span>
              </label>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={form.min_population}
                onChange={e => update('min_population', Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>50 тыс.</span>
                <span>1000 тыс.</span>
                <span>2000 тыс.</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Макс. расстояние от домашнего региона: <span className="text-emerald-600 font-bold">{form.max_distance_from_home_km} км</span>
              </label>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={form.max_distance_from_home_km}
                onChange={e => update('max_distance_from_home_km', Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100 км</span>
                <span>2500 км</span>
                <span>5000 км</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h3 className="font-medium text-emerald-900 mb-2">Сводка брифа</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-emerald-700">Компания:</div>
                <div className="text-emerald-900 font-medium">{form.company_name || '—'}</div>
                <div className="text-emerald-700">Сегмент:</div>
                <div className="text-emerald-900 font-medium">
                  {form.target_segment === 'economy' ? 'Эконом' : form.target_segment === 'comfort' ? 'Комфорт' : 'Бизнес'}
                </div>
                <div className="text-emerald-700">Технология:</div>
                <div className="text-emerald-900 font-medium">
                  {form.construction_type === 'monolith' ? 'Монолит' : form.construction_type === 'brick' ? 'Кирпич' : form.construction_type === 'panel' ? 'Панель' : 'Смешанная'}
                </div>
                <div className="text-emerald-700">Тип:</div>
                <div className="text-emerald-900 font-medium">
                  {form.building_type === 'apartment' ? 'МКД' : form.building_type === 'izhs' ? 'ИЖС' : 'Смешанный'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
            >
              Далее
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Получить рейтинг регионов'}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
