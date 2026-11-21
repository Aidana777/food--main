import { ArrowRight } from 'lucide-react';
import { ADVANTAGES, HERO_IMAGE } from '../data/menuData';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onOrderNow: () => void;
}

export function Hero({ onOrderNow }: HeroProps) {
  return (
    <section id="top" className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs font-medium text-zinc-500 tracking-wide mb-4">
              Бистро и доставка · Ежедневно 09:00–22:00
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-[#141413] text-balance mb-5">
              Вкусные блюда — с доставкой к вашему столу
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl mb-8">
              Выбирайте любимые блюда из меню, оформляйте заказ онлайн за пару минут и наслаждайтесь свежеприготовленной едой дома или в офисе.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4E3D]"
              >
                <span>Посмотреть меню</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOrderNow}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-[#141413] text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4E3D]"
              >
                Заказать сейчас
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
              <span>Готовим после заказа</span>
              <span aria-hidden="true">·</span>
              <span>Бесплатная доставка от 2 000 ₽</span>
              <span aria-hidden="true">·</span>
              <span>Удобный самовывоз</span>
            </div>
          </div>

          {/* Right Media Column */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] rounded-xl overflow-hidden bg-[#F4F4F5]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Накрытый стол бистро Вербена: стейк из лосося со спаржей, буррата с томатами, ремесленный хлеб и цитрусовые напитки"
                className="w-full h-full lg:h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-pillar Advantages Strip */}
        <div className="mt-10 lg:mt-14 pt-8 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ADVANTAGES.map((item) => (
            <div key={item.title} className="space-y-1.5">
              <h2 className="text-sm font-semibold text-[#141413]">{item.title}</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
