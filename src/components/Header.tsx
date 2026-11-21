import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface HeaderProps {
  totalItems: number;
  subtotal: number;
  onOpenCart: () => void;
  onSelectCombos: () => void;
}

export function Header({ totalItems, subtotal, onOpenCart, onSelectCombos }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (isCombos?: boolean) => {
    setMobileMenuOpen(false);
    if (isCombos) {
      onSelectCombos();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-[#141413] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F4E3D]"
        >
          Вербена
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
        >
          <a
            href="#menu"
            className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Меню
          </a>
          <a
            href="#menu"
            onClick={() => onSelectCombos()}
            className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Акции
          </a>
          <a
            href="#about"
            className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            О нас
          </a>
          <a
            href="#delivery"
            className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Доставка
          </a>
          <a
            href="#contacts"
            className="hover:text-[#141413] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Контакты
          </a>
        </nav>

        {/* Zone 3: Primary Action (Cart / Order) + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Открыть корзину, позиций: ${totalItems}`}
            className="inline-flex items-center gap-2.5 min-h-[40px] px-4 py-2 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4E3D]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{totalItems > 0 ? 'Корзина' : 'Заказать'}</span>
            {totalItems > 0 && (
              <span className="tabular-nums text-xs text-white/90 border-l border-white/25 pl-2">
                {totalItems} · {formatPrice(subtotal)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Закрыть меню навигации' : 'Открыть меню навигации'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-zinc-200 text-[#141413] hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Мобильная навигация"
          className="md:hidden border-t border-zinc-200 bg-[#FAFAFA] px-4 py-4 space-y-1"
        >
          <a
            href="#menu"
            onClick={() => handleLinkClick(false)}
            className="block px-3 py-3 text-base font-medium text-[#141413] rounded-lg hover:bg-zinc-100"
          >
            Меню
          </a>
          <a
            href="#menu"
            onClick={() => handleLinkClick(true)}
            className="block px-3 py-3 text-base font-medium text-[#141413] rounded-lg hover:bg-zinc-100"
          >
            Акции и комбо
          </a>
          <a
            href="#about"
            onClick={() => handleLinkClick(false)}
            className="block px-3 py-3 text-base font-medium text-[#141413] rounded-lg hover:bg-zinc-100"
          >
            О нас
          </a>
          <a
            href="#delivery"
            onClick={() => handleLinkClick(false)}
            className="block px-3 py-3 text-base font-medium text-[#141413] rounded-lg hover:bg-zinc-100"
          >
            Доставка
          </a>
          <a
            href="#contacts"
            onClick={() => handleLinkClick(false)}
            className="block px-3 py-3 text-base font-medium text-[#141413] rounded-lg hover:bg-zinc-100"
          >
            Контакты
          </a>
        </nav>
      )}
    </header>
  );
}
