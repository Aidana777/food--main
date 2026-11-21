import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '../data/menuData';
import { CartItem, OrderSubmission } from '../types/menu';
import { formatPrice } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartKey: string, delta: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'confirmed';

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('Как можно быстрее');
  const [paymentMethod, setPaymentMethod] = useState<'card_on_delivery' | 'cash' | 'online_sbp'>(
    'card_on_delivery'
  );
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderSubmission | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset back to cart step if user reopens after confirming and starting fresh
  useEffect(() => {
    if (isOpen && step === 'confirmed' && items.length > 0) {
      setStep('cart');
      setConfirmedOrder(null);
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const addonsTotal = item.selectedAddons.reduce((aSum, a) => aSum + a.price, 0);
    return sum + (item.dish.price + addonsTotal) * item.quantity;
  }, 0);

  const deliveryFee =
    items.length === 0 || deliveryMethod === 'pickup' || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;

  const total = subtotal + deliveryFee;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Корзина пуста. Добавьте хотя бы одно блюдо.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Пожалуйста, укажите ваше имя.');
      return;
    }
    const digitsCount = phone.replace(/\D/g, '').length;
    if (digitsCount < 7) {
      setFormError('Пожалуйста, укажите корректный номер телефона для подтверждения.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setFormError('Укажите адрес доставки или переключите способ получения на «Самовывоз».');
      return;
    }

    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const submission: OrderSubmission = {
      orderNumber,
      customerName: customerName.trim(),
      phone: phone.trim(),
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address.trim() : undefined,
      preferredTime,
      paymentMethod,
      comment: comment.trim() || undefined,
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setConfirmedOrder(submission);
    onClearCart();
    setStep('confirmed');
  };

  const handleCloseAndReset = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px]"
      onClick={handleCloseAndReset}
      role="dialog"
      aria-modal="true"
      aria-label="Корзина и оформление заказа"
    >
      <div
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Назад в корзину"
                className="p-1.5 -ml-1.5 rounded-lg text-zinc-600 hover:text-[#141413] hover:bg-zinc-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-2xl font-semibold text-[#141413]">
              {step === 'cart' && 'Ваш заказ'}
              {step === 'checkout' && 'Оформление заказа'}
              {step === 'confirmed' && 'Заказ оформлен'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseAndReset}
            aria-label="Закрыть корзину"
            className="w-10 h-10 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-[#141413] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Cart Items */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#F4F4F5] flex items-center justify-center text-zinc-500">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium text-[#141413]">Корзина пока пуста</p>
                    <p className="text-sm text-zinc-500 max-w-xs">
                      Выберите блюда из меню — они сразу появятся здесь для проверки и оформления.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[40px] px-5 py-2 rounded-lg bg-[#1F4E3D] text-white text-sm font-medium hover:bg-[#163A2D] transition-colors cursor-pointer"
                  >
                    Перейти к меню
                  </button>
                </div>
              ) : (
                <>
                  {/* Free delivery threshold info */}
                  <div className="px-4 py-3 rounded-lg bg-[#FAFAFA] border border-zinc-200 text-xs text-zinc-600">
                    {amountToFreeDelivery > 0 ? (
                      <span>
                        До бесплатной доставки добавьте блюд ещё на{' '}
                        <strong className="text-[#141413] tabular-nums">
                          {formatPrice(amountToFreeDelivery)}
                        </strong>{' '}
                        (или выберите бесплатный самовывоз).
                      </span>
                    ) : (
                      <span className="text-[#1F4E3D] font-medium">
                        Бесплатная доставка по городу активирована для вашего заказа.
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-zinc-200">
                    {items.map((item) => {
                      const addonsSum = item.selectedAddons.reduce((s, a) => s + a.price, 0);
                      const lineTotal = (item.dish.price + addonsSum) * item.quantity;

                      return (
                        <div key={item.cartKey} className="py-4 flex gap-4">
                          <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#F4F4F5] shrink-0">
                            <ResilientImage
                              src={item.dish.image}
                              alt={item.dish.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-semibold text-[#141413] leading-snug">
                                {item.dish.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.cartKey)}
                                aria-label={`Удалить ${item.dish.name}`}
                                className="p-1 text-zinc-400 hover:text-red-600 cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-xs text-zinc-500 mt-0.5 tabular-nums">
                              {item.dish.weight}
                            </div>

                            {item.selectedAddons.length > 0 && (
                              <ul className="mt-1.5 space-y-0.5 text-xs text-zinc-600">
                                {item.selectedAddons.map((addon) => (
                                  <li key={addon.id}>
                                    + {addon.name}
                                    {addon.price > 0 ? ` (${formatPrice(addon.price)})` : ''}
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="inline-flex items-center border border-zinc-200 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.cartKey, -1)}
                                  aria-label="Уменьшить количество"
                                  className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-[#141413] cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-semibold tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.cartKey, 1)}
                                  aria-label="Увеличить количество"
                                  className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-[#141413] cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-sm font-semibold text-[#141413] tabular-nums">
                                {formatPrice(lineTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-[#FAFAFA] space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Сумма блюд</span>
                    <span className="tabular-nums font-medium text-[#141413]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Доставка</span>
                    <span className="tabular-nums">
                      {subtotal >= FREE_DELIVERY_THRESHOLD
                        ? 'Бесплатно'
                        : `От ${formatPrice(STANDARD_DELIVERY_FEE)} (самовывоз 0 ₽)`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="min-h-[44px] px-4 py-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 cursor-pointer"
                  >
                    Очистить
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="flex-1 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors cursor-pointer"
                  >
                    Перейти к оформлению
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 2: Checkout Form */}
        {step === 'checkout' && (
          <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Delivery Method Toggle */}
              <div>
                <span className="block text-xs font-medium text-zinc-600 mb-2">
                  Способ получения
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4F4F5] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`min-h-[40px] rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      deliveryMethod === 'delivery'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-zinc-600 hover:text-[#141413]'
                    }`}
                  >
                    Доставка
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`min-h-[40px] rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      deliveryMethod === 'pickup'
                        ? 'bg-white text-[#141413] shadow-xs'
                        : 'text-zinc-600 hover:text-[#141413]'
                    }`}
                  >
                    Самовывоз (0 ₽)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="order-name" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Имя *
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Как к вам обращаться"
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#1F4E3D]"
                  />
                </div>

                <div>
                  <label htmlFor="order-phone" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Телефон *
                  </label>
                  <input
                    id="order-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#1F4E3D] tabular-nums"
                  />
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div>
                    <label htmlFor="order-address" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      Адрес доставки *
                    </label>
                    <input
                      id="order-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Улица, дом, подъезд, квартира"
                      className="w-full min-h-[42px] px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#1F4E3D]"
                    />
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-lg bg-[#FAFAFA] border border-zinc-200 text-xs text-zinc-600">
                    Адрес самовывоза: ул. Садовая, 14 (ежедневно 09:00–22:00). Заказ будет готов ориентировочно через 20–30 минут после подтверждения.
                  </div>
                )}

                <div>
                  <label htmlFor="order-time" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Удобное время
                  </label>
                  <select
                    id="order-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-[#1F4E3D]"
                  >
                    <option value="Как можно быстрее">Как можно быстрее</option>
                    <option value="В течение 1–2 часов">В течение 1–2 часов</option>
                    <option value="К обеду (13:00–14:00)">К обеду (13:00–14:00)</option>
                    <option value="К ужину (19:00–20:00)">К ужину (19:00–20:00)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order-payment" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Способ оплаты
                  </label>
                  <select
                    id="order-payment"
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value as 'card_on_delivery' | 'cash' | 'online_sbp'
                      )
                    }
                    className="w-full min-h-[42px] px-3.5 py-2 text-sm border border-zinc-300 rounded-lg bg-white focus:outline-none focus:border-[#1F4E3D]"
                  >
                    <option value="card_on_delivery">Картой при получении</option>
                    <option value="cash">Наличными при получении</option>
                    <option value="online_sbp">Перевод по СБП после подтверждения</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order-comment" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    Комментарий к заказу
                  </label>
                  <textarea
                    id="order-comment"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Код домофона, количество приборов, пожелания по блюдам"
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#1F4E3D]"
                  />
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-800"
                >
                  {formError}
                </div>
              )}
            </div>

            {/* Checkout Summary Footer */}
            <div className="p-6 border-t border-zinc-200 bg-[#FAFAFA] space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Блюда ({items.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>{deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? 'Бесплатно' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#141413] pt-2 border-t border-zinc-200">
                  <span>Итого к оплате</span>
                  <span className="tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] px-5 py-3 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Оформить заказ
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation Receipt */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-7 h-7 text-[#1F4E3D] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-zinc-500 tabular-nums">
                    Заказ {confirmedOrder.orderNumber} · {confirmedOrder.createdAt}
                  </div>
                  <h3 className="text-lg font-semibold text-[#141413] leading-snug">
                    Спасибо! Ваш заказ отправлен. Мы свяжемся с вами для подтверждения.
                  </h3>
                </div>
              </div>

              <div className="bg-[#FAFAFA] border border-zinc-200 rounded-xl p-5 space-y-4 text-sm">
                <div className="space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Получатель</span>
                    <span className="font-medium text-[#141413] text-right">
                      {confirmedOrder.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Телефон</span>
                    <span className="font-medium text-[#141413] text-right tabular-nums">
                      {confirmedOrder.phone}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Способ получения</span>
                    <span className="font-medium text-[#141413] text-right">
                      {confirmedOrder.deliveryMethod === 'delivery'
                        ? `Доставка: ${confirmedOrder.address}`
                        : 'Самовывоз (ул. Садовая, 14)'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500">Время</span>
                    <span className="font-medium text-[#141413] text-right">
                      {confirmedOrder.preferredTime}
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-3 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Состав заказа
                  </div>
                  {confirmedOrder.items.map((item) => {
                    const addonsSum = item.selectedAddons.reduce((s, a) => s + a.price, 0);
                    return (
                      <div key={item.cartKey} className="flex justify-between gap-4 text-xs">
                        <span className="text-zinc-700">
                          {item.dish.name} × {item.quantity}
                          {item.selectedAddons.length > 0 &&
                            ` (${item.selectedAddons.map((a) => a.name).join(', ')})`}
                        </span>
                        <span className="tabular-nums font-medium text-[#141413] shrink-0">
                          {formatPrice((item.dish.price + addonsSum) * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-200 pt-3 flex justify-between font-semibold text-[#141413]">
                  <span>Итого</span>
                  <span className="tabular-nums">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAndReset}
              className="w-full min-h-[44px] px-5 py-3 rounded-lg bg-[#1F4E3D] hover:bg-[#163A2D] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Вернуться в меню
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
