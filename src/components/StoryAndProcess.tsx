import { ABOUT_IMAGE, ORDER_STEPS } from '../data/menuData';
import { ResilientImage } from './ResilientImage';

export function StoryAndProcess() {
  return (
    <section id="about" className="py-14 lg:py-20 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Us Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F4F5]">
              <ResilientImage
                src={ABOUT_IMAGE}
                alt="Открытая кухня бистро Вербена: повар сервирует блюдо свежей зеленью"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-medium text-zinc-500">О заведении</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] tracking-tight text-balance">
              Кухня, где ценят вкус продукта и ваше время
            </h2>
            <p className="text-base text-zinc-600 leading-relaxed">
              «Вербена» — это современное городское бистро с собственной доставкой. Мы делаем ставку на понятную авторскую кухню без лишней суеты: свежая рыба, фермерские сыры, домашняя паста и хлеб собственной выпечки.
            </p>
            <p className="text-base text-zinc-600 leading-relaxed">
              Мы не держим готовые блюда на витрине — кухня начинает готовить сразу после подтверждения вашего заказа, а плотные термоконтейнеры сохраняют температуру и аккуратную подачу до самой двери.
            </p>

            <div className="pt-4 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-semibold text-[#141413] tabular-nums">45–60 мин</div>
                <div className="text-xs text-zinc-500 mt-1">среднее время доставки</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#141413] tabular-nums">от 2 000 ₽</div>
                <div className="text-xs text-zinc-500 mt-1">бесплатная доставка</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#141413] tabular-nums">09:00–22:00</div>
                <div className="text-xs text-zinc-500 mt-1">приём заказов ежедневно</div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Order Process */}
        <div className="pt-12 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Как оформить заказ</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] tracking-tight">
                Четыре простых шага до готового ужина
              </h2>
            </div>
            <p className="text-sm text-zinc-600 max-w-md">
              Оформление заказа занимает меньше двух минут — без обязательной регистрации и сложных форм.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {ORDER_STEPS.map((item) => (
              <div key={item.step} className="pt-4 border-t border-zinc-200 space-y-2">
                <span className="text-xs font-semibold text-[#1F4E3D] tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-base font-semibold text-[#141413]">{item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
