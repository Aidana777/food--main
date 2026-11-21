import { useState } from 'react';
import { ChevronDown, Clock, MapPin, Phone, Star } from 'lucide-react';
import {
  DEMO_REVIEWS,
  FAQ_ITEMS,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
} from '../data/menuData';
import { formatPrice } from '../utils/format';

interface ReviewsFaqDeliveryProps {
  onOpenCart: () => void;
}

export function ReviewsFaqDelivery({ onOpenCart }: ReviewsFaqDeliveryProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <>
      {/* Reviews Section */}
      <section className="py-14 lg:py-20 bg-[#FAFAFA] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Впечатления гостей</p>
              <h2 className="font-display text-3xl font-semibold text-[#141413] tracking-tight">
                Отзывы о кухне и доставке
              </h2>
            </div>
            <p className="text-xs text-zinc-500">
              Демо-отзывы для презентации макета (заменяются на реальные отзывы гостей)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {DEMO_REVIEWS.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#1F4E3D]" aria-label={`Оценка ${review.rating} из 5`}>
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">«{review.text}»</p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100">
                  <div className="text-sm font-semibold text-[#141413]">{review.author}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Заказ: {review.dishOrdered}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery & Contacts + FAQ */}
      <section id="delivery" className="py-14 lg:py-20 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Delivery & Contacts */}
          <div id="contacts" className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Доставка и контакты</p>
              <h2 className="font-display text-3xl font-semibold text-[#141413] tracking-tight">
                Условия получения заказа
              </h2>
            </div>

            <div className="space-y-4 text-sm text-zinc-700 border-t border-zinc-200 pt-5">
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Доставка по городу</span>
                <span className="font-medium text-[#141413] text-right tabular-nums">
                  {formatPrice(STANDARD_DELIVERY_FEE)} (бесплатно от {formatPrice(FREE_DELIVERY_THRESHOLD)})
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Ориентировочное время</span>
                <span className="font-medium text-[#141413] text-right tabular-nums">
                  45–60 минут
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-zinc-500">Самовывоз</span>
                <span className="font-medium text-[#141413] text-right">
                  Бесплатно, без минимальной суммы
                </span>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-zinc-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1F4E3D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-sm font-medium text-[#141413]">
                    ул. Садовая, 14 (пример адреса для макета)
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Пункт самовывоза и кухня бистро
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#1F4E3D] mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-sm text-zinc-700">
                  Ежедневно с 09:00 до 22:00
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#1F4E3D] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <a
                    href="tel:+74950000000"
                    className="text-sm font-medium text-[#141413] hover:text-[#1F4E3D] tabular-nums"
                  >
                    +7 (495) 000-00-00
                  </a>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Демо-телефон приёма заказов
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600">
                <a href="#contacts" className="hover:text-[#1F4E3D] underline underline-offset-4">
                  Telegram
                </a>
                <a href="#contacts" className="hover:text-[#1F4E3D] underline underline-offset-4">
                  ВКонтакте
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Перейти к оформлению заказа
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-2">Частые вопросы</p>
              <h2 className="font-display text-3xl font-semibold text-[#141413] tracking-tight">
                Ответы перед заказом
              </h2>
            </div>

            <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="w-full py-4 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="text-sm sm:text-base font-medium text-[#141413] group-hover:text-[#1F4E3D] transition-colors">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#1F4E3D]' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="pb-4 pr-8 text-sm text-zinc-600 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-[#FAFAFA] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold text-[#141413]">Вербена</span>
            <span aria-hidden="true">·</span>
            <span>Бистро и доставка еды</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#menu" className="hover:text-[#141413]">
              Меню
            </a>
            <a href="#about" className="hover:text-[#141413]">
              О нас
            </a>
            <a href="#delivery" className="hover:text-[#141413]">
              Доставка
            </a>
            <a href="#contacts" className="hover:text-[#141413]">
              Контакты
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
