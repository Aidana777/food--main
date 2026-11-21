import { useMemo, useState } from 'react';
import { Minus, Plus, Search, X } from 'lucide-react';
import { CATEGORIES, DISHES, TAG_LABELS } from '../data/menuData';
import { CartItem, CategoryId, Dish, DishTag } from '../types/menu';
import { formatPrice } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface MenuSectionProps {
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  cartItems: CartItem[];
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  onUpdateSimpleQuantity: (dishId: string, delta: number) => void;
}

const FILTER_TAGS: { id: 'all' | DishTag; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'popular', label: 'Популярное' },
  { id: 'new', label: 'Новинки' },
  { id: 'vegetarian', label: 'Вегетарианское' },
  { id: 'spicy', label: 'Острое' },
];

export function MenuSection({
  activeCategory,
  onSelectCategory,
  cartItems,
  onSelectDish,
  onQuickAdd,
  onUpdateSimpleQuantity,
}: MenuSectionProps) {
  const [activeTag, setActiveTag] = useState<'all' | DishTag>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategoryInfo = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0],
    [activeCategory]
  );

  const filteredDishes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DISHES.filter((dish) => {
      if (activeCategory !== 'all' && dish.category !== activeCategory) {
        return false;
      }
      if (activeTag !== 'all' && !dish.tags.includes(activeTag)) {
        return false;
      }
      if (query.length > 0) {
        const haystack = `${dish.name} ${dish.description} ${dish.ingredients.join(' ')}`.toLowerCase();
        return haystack.includes(query);
      }
      return true;
    });
  }, [activeCategory, activeTag, searchQuery]);

  // Helper to get total quantity of a dish without add-ons in cart for quick stepper
  const getSimpleDishQuantity = (dishId: string) => {
    return cartItems
      .filter((item) => item.dish.id === dishId && item.selectedAddons.length === 0)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalDishQuantity = (dishId: string) => {
    return cartItems
      .filter((item) => item.dish.id === dishId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <section id="menu" className="py-14 lg:py-20 bg-[#FAFAFA] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-zinc-500">Меню кухни и рекомендации</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413] tracking-tight text-balance">
              {activeCategoryInfo.label}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              {activeCategoryInfo.subtitle}. Нажмите на любое блюдо, чтобы посмотреть полный состав, аллергены и выбрать дополнения.
            </p>
          </div>

          <div className="w-full md:w-72 shrink-0">
            <label htmlFor="menu-search" className="sr-only">
              Поиск по меню
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Найти блюдо или ингредиент"
                className="w-full min-h-[42px] pl-10 pr-9 py-2 text-sm bg-white border border-zinc-200 rounded-lg text-[#141413] placeholder:text-zinc-400 focus:outline-none focus:border-[#1F4E3D]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Очистить поиск"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Cards / Filter Strip */}
        <div
          role="tablist"
          aria-label="Категории меню"
          className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(category.id)}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-[#1F4E3D] border-[#1F4E3D] text-white'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:text-[#141413]'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Dietary / Popular Filter Bar */}
        <div className="mt-4 mb-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_TAGS.map((tag) => {
              const isSelected = activeTag === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setActiveTag(tag.id)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#141413] text-white'
                      : 'bg-zinc-200/70 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-500 tabular-nums">
            Показано позиций: {filteredDishes.length}
          </p>
        </div>

        {/* Dish Grid */}
        {filteredDishes.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center space-y-3">
            <p className="text-base font-medium text-[#141413]">
              По выбранным параметрам блюда не найдены
            </p>
            <p className="text-sm text-zinc-600">
              Попробуйте сбросить фильтры или изменить поисковый запрос.
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                setActiveTag('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center justify-center min-h-[40px] px-5 py-2 rounded-lg bg-[#1F4E3D] text-white text-sm font-medium hover:bg-[#163A2D] transition-colors cursor-pointer"
            >
              Показать всё меню
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDishes.map((dish) => {
              const simpleQty = getSimpleDishQuantity(dish.id);
              const totalQty = getTotalDishQuantity(dish.id);
              const primaryTag = dish.tags[0] ? TAG_LABELS[dish.tags[0]] : null;

              return (
                <article
                  key={dish.id}
                  className="group bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {/* Image Container (4:3 uniform aspect ratio) */}
                  <button
                    type="button"
                    onClick={() => onSelectDish(dish)}
                    className="relative aspect-[4/3] w-full bg-[#F4F4F5] overflow-hidden text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1F4E3D]"
                    aria-label={`Подробнее о блюде ${dish.name}`}
                  >
                    <ResilientImage
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Clean unboxed metadata line */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                      <span className="tabular-nums">{dish.weight}</span>
                      {primaryTag && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#1F4E3D] font-medium">{primaryTag}</span>
                        </>
                      )}
                      {totalQty > simpleQty && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">В корзине с доп.: {totalQty}</span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectDish(dish)}
                      className="text-left cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-[#141413] leading-snug group-hover:text-[#1F4E3D] transition-colors">
                        {dish.name}
                      </h3>
                    </button>

                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>

                    <p className="mt-2.5 text-xs text-zinc-500 line-clamp-1">
                      Состав: {dish.ingredients.join(', ')}
                    </p>

                    {/* Baseline-aligned Price & Action Row */}
                    <div className="mt-auto pt-5 flex items-center justify-between gap-4 border-t border-zinc-100 mt-5">
                      <div className="text-lg font-semibold text-[#141413] tabular-nums">
                        {formatPrice(dish.price)}
                      </div>

                      {simpleQty > 0 ? (
                        <div className="inline-flex items-center border border-[#1F4E3D] rounded-lg bg-[#1F4E3D]/5">
                          <button
                            type="button"
                            onClick={() => onUpdateSimpleQuantity(dish.id, -1)}
                            aria-label={`Убрать одну порцию ${dish.name}`}
                            className="w-10 h-10 flex items-center justify-center text-[#1F4E3D] hover:bg-[#1F4E3D]/10 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#1F4E3D] tabular-nums">
                            {simpleQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateSimpleQuantity(dish.id, 1)}
                            aria-label={`Добавить ещё одну порцию ${dish.name}`}
                            className="w-10 h-10 flex items-center justify-center text-[#1F4E3D] hover:bg-[#1F4E3D]/10 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onQuickAdd(dish)}
                          className="min-h-[40px] px-4 py-2 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          В корзину
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
