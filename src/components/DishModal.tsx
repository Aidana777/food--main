import { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { TAG_LABELS } from '../data/menuData';
import { Dish, DishAddon } from '../types/menu';
import { formatPrice } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (dish: Dish, selectedAddons: DishAddon[], quantity: number) => void;
}

export function DishModal({ dish, onClose, onAddToCart }: DishModalProps) {
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedAddonIds([]);
    setQuantity(1);
  }, [dish?.id]);

  useEffect(() => {
    if (!dish) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, onClose]);

  if (!dish) return null;

  const selectedAddons = dish.addons.filter((addon) => selectedAddonIds.includes(addon.id));
  const addonsSum = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const unitPrice = dish.price + addonsSum;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onAddToCart(dish, selectedAddons, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть карточку блюда"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-white/95 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[#141413] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Side */}
        <div className="md:w-1/2 bg-[#F4F4F5] shrink-0">
          <div className="aspect-[4/3] md:aspect-auto md:h-full w-full">
            <ResilientImage
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details & Purchase Module Side */}
        <div className="md:w-1/2 flex flex-col max-h-[60vh] md:max-h-[90vh]">
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-2">
                <span className="tabular-nums">{dish.weight}</span>
                {dish.tags.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{dish.tags.map((t) => TAG_LABELS[t]).join(' · ')}</span>
                  </>
                )}
              </div>

              <h2
                id="dish-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] leading-tight text-balance"
              >
                {dish.name}
              </h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                О блюде
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">{dish.fullDescription}</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-zinc-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Состав и аллергены
              </h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {dish.ingredients.join(', ')}.
              </p>
              {dish.allergens && (
                <p className="text-xs text-zinc-500">
                  Возможные аллергены: {dish.allergens}.
                </p>
              )}
            </div>

            {dish.addons.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Дополнения к блюду
                </h3>
                <div className="space-y-2">
                  {dish.addons.map((addon) => {
                    const checked = selectedAddonIds.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border text-left text-sm transition-colors cursor-pointer ${
                          checked
                            ? 'border-[#1F4E3D] bg-[#1F4E3D]/5 text-[#141413]'
                            : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              checked
                                ? 'bg-[#1F4E3D] border-[#1F4E3D] text-white'
                                : 'border-zinc-300 bg-white'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" strokeWidth={2.5} />}
                          </span>
                          <span>{addon.name}</span>
                        </span>
                        <span className="tabular-nums text-xs font-medium text-zinc-600 shrink-0">
                          {addon.price > 0 ? `+${formatPrice(addon.price)}` : 'Бесплатно'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer Purchase Bar */}
          <div className="p-5 sm:px-8 border-t border-zinc-200 bg-[#FAFAFA] flex items-center gap-4">
            <div className="inline-flex items-center border border-zinc-300 rounded-lg bg-white shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Уменьшить количество"
                className="w-10 h-11 flex items-center justify-center text-zinc-700 hover:text-[#141413] cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Увеличить количество"
                className="w-10 h-11 flex items-center justify-center text-zinc-700 hover:text-[#141413] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors duration-150 tabular-nums cursor-pointer"
            >
              Добавить в корзину · {formatPrice(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
