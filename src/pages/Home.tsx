import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, MapPin, FileText, Building2, TrendingUp, Shield, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('ru-RU')}
      {suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 text-emerald-300" />
              Аналитическая платформа для девелоперов
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Оценка инвестиционной{' '}
              <span className="text-emerald-300">привлекательности</span>{' '}
              регионов и земельных участков
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/80 mb-10 max-w-2xl leading-relaxed">
              Принимайте решения об экспансии на основе данных. Скоринговая модель 
              с 27 параметрами для регионов и 29 параметрами для участков.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/brief"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30"
              >
                <FileText className="h-5 w-5" />
                Заполнить бриф
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/regions"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20"
              >
                <BarChart3 className="h-5 w-5" />
                Смотреть регионы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 85, suffix: '', label: 'Регионов РФ в базе' },
              { value: 27, suffix: '', label: 'Параметров скоринга регионов' },
              { value: 29, suffix: '', label: 'Параметров скоринга участков' },
              { value: 8, suffix: '', label: 'Блоков оценки' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Как это работает</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Три простых шага от брифа до инвестиционного решения</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Заполните бриф',
                desc: 'Расскажите о вашей компании: текущие регионы, технология строительства, тип продукта и целевой сегмент',
                color: 'bg-emerald-100 text-emerald-600',
              },
              {
                step: '02',
                icon: BarChart3,
                title: 'Получите рейтинг регионов',
                desc: 'Алгоритм подберёт и отранжирует регионы по скорингу (27 параметров) и мэтчингу с вашей стратегией',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                step: '03',
                icon: MapPin,
                title: 'Изучите участки',
                desc: 'Провалитесь в регион — изучите земельные участки на карте с детальным скорингом (29 параметров)',
                color: 'bg-amber-100 text-amber-600',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <span className="text-sm font-bold text-gray-300">{item.step}</span>
                  <div className={`inline-flex p-3 rounded-xl ${item.color} mt-4 mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Возможности платформы</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Всё необходимое для принятия инвестиционных решений</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: 'Персонализированный подбор',
                desc: 'Алгоритм учитывает вашу технологию строительства, тип продукта и стратегию экспансии',
              },
              {
                icon: TrendingUp,
                title: 'Многофакторный скоринг',
                desc: '27 параметров для регионов и 29 для участков: демография, экономика, инфраструктура, админ. климат',
              },
              {
                icon: MapPin,
                title: 'Карта с участками',
                desc: 'Интерактивная карта с земельными участками, отфильтрованными под ваш профиль',
              },
              {
                icon: Shield,
                title: '3 сегмента рынка',
                desc: 'Отдельные шкалы для эконом, комфорт и бизнес-класса с разными весами параметров',
              },
              {
                icon: BarChart3,
                title: 'Детальная аналитика',
                desc: 'Развёрнутый скоринг по 8 блокам: от демографии до престижа региона',
              },
              {
                icon: Zap,
                title: 'Реальные данные',
                desc: 'Данные Росстата, НСПД, Дом.рф, ЦИАН и других источников для точных расчётов',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                  <div className="inline-flex p-3 rounded-xl bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Готовы оценить регионы для экспансии?</h2>
          <p className="text-emerald-200 mb-8 max-w-2xl mx-auto">
            Заполните бриф — и через минуту получите персонализированный рейтинг регионов РФ 
            с детальным скорингом по 27 параметрам
          </p>
          <Link
            to="/brief"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg"
          >
            <FileText className="h-5 w-5" />
            Начать анализ
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
