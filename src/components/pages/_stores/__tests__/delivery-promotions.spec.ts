import { describe, it, expect } from 'vitest';
import {
  applyPromotion,
  resolveBadgeText,
  resolveScopePriority,
  DEFAULT_BADGE_TEXT,
  type DeliveryPromotion,
} from '../pricing-announcements/delivery-promotions-utils';

// ---------------------------------------------------------------------------
// applyPromotion — pure pricing logic
// ---------------------------------------------------------------------------

describe('applyPromotion', () => {
  it('returns base price unchanged when promo is null', () => {
    expect(applyPromotion(30, null)).toBe(30);
  });

  it('FIXED_PRICE: returns promoValue as the delivery price regardless of base', () => {
    expect(applyPromotion(30, { discountType: 'FIXED_PRICE', promoValue: 10 })).toBe(10);
    expect(applyPromotion(5, { discountType: 'FIXED_PRICE', promoValue: 15 })).toBe(15);
  });

  it('FIXED_PRICE: floors at 0 when promoValue is negative', () => {
    expect(applyPromotion(20, { discountType: 'FIXED_PRICE', promoValue: -5 })).toBe(0);
  });

  it('DISCOUNT_AMOUNT: subtracts promoValue from base price', () => {
    expect(applyPromotion(30, { discountType: 'DISCOUNT_AMOUNT', promoValue: 10 })).toBe(20);
  });

  it('DISCOUNT_AMOUNT: floors result at 0 when discount exceeds base', () => {
    expect(applyPromotion(5, { discountType: 'DISCOUNT_AMOUNT', promoValue: 20 })).toBe(0);
  });

  it('DISCOUNT_AMOUNT: handles zero promoValue (no change)', () => {
    expect(applyPromotion(25, { discountType: 'DISCOUNT_AMOUNT', promoValue: 0 })).toBe(25);
  });

  it('FIXED_PRICE: promoValue of 0 means free delivery', () => {
    expect(applyPromotion(50, { discountType: 'FIXED_PRICE', promoValue: 0 })).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// resolveBadgeText — fallback logic
// ---------------------------------------------------------------------------

describe('resolveBadgeText', () => {
  it('returns the provided badge text when non-empty', () => {
    expect(resolveBadgeText('توصيل سريع')).toBe('توصيل سريع');
  });

  it('falls back to DEFAULT_BADGE_TEXT when null', () => {
    expect(resolveBadgeText(null)).toBe(DEFAULT_BADGE_TEXT);
  });

  it('falls back to DEFAULT_BADGE_TEXT when undefined', () => {
    expect(resolveBadgeText(undefined)).toBe(DEFAULT_BADGE_TEXT);
  });

  it('falls back to DEFAULT_BADGE_TEXT when empty string', () => {
    expect(resolveBadgeText('')).toBe(DEFAULT_BADGE_TEXT);
  });

  it('falls back to DEFAULT_BADGE_TEXT when whitespace-only string', () => {
    expect(resolveBadgeText('   ')).toBe(DEFAULT_BADGE_TEXT);
  });

  it('trims whitespace from valid badge text', () => {
    expect(resolveBadgeText('  عرض خاص  ')).toBe('عرض خاص');
  });

  it('DEFAULT_BADGE_TEXT is the expected Arabic string', () => {
    expect(DEFAULT_BADGE_TEXT).toBe('توصيل مخفض لفترة محدودة');
  });
});

// ---------------------------------------------------------------------------
// resolveScopePriority — scope priority logic
// ---------------------------------------------------------------------------

const makePromo = (
  overrides: Partial<DeliveryPromotion> & Pick<DeliveryPromotion, 'id' | 'scope'>
): DeliveryPromotion => ({
  name: 'Test Promo',
  badgeText: null,
  discountType: 'DISCOUNT_AMOUNT',
  promoValue: 5,
  isActive: true,
  ...overrides,
});

describe('resolveScopePriority', () => {
  it('returns null when no promotions exist', () => {
    expect(resolveScopePriority([], { storeId: 1, zoneId: 2 })).toBeNull();
  });

  it('returns null when all promotions are inactive', () => {
    const promos = [
      makePromo({ id: 1, scope: 'GLOBAL', isActive: false }),
    ];
    expect(resolveScopePriority(promos, {})).toBeNull();
  });

  it('returns GLOBAL promo when no more-specific match exists', () => {
    const global = makePromo({ id: 1, scope: 'GLOBAL' });
    const result = resolveScopePriority([global], { storeId: 99, zoneId: 99 });
    expect(result?.id).toBe(1);
  });

  it('STORE wins over GLOBAL for matching storeId', () => {
    const global = makePromo({ id: 1, scope: 'GLOBAL' });
    const store = makePromo({ id: 2, scope: 'STORE', storeId: 5 });
    const result = resolveScopePriority([global, store], { storeId: 5 });
    expect(result?.id).toBe(2);
  });

  it('ZONE wins over GLOBAL for matching zoneId', () => {
    const global = makePromo({ id: 1, scope: 'GLOBAL' });
    const zone = makePromo({ id: 3, scope: 'ZONE', zoneId: 7 });
    const result = resolveScopePriority([global, zone], { zoneId: 7 });
    expect(result?.id).toBe(3);
  });

  it('STORE_ZONE wins over all others when both match', () => {
    const global = makePromo({ id: 1, scope: 'GLOBAL' });
    const store = makePromo({ id: 2, scope: 'STORE', storeId: 5 });
    const zone = makePromo({ id: 3, scope: 'ZONE', zoneId: 7 });
    const storeZone = makePromo({ id: 4, scope: 'STORE_ZONE', storeId: 5, zoneId: 7 });
    const result = resolveScopePriority([global, store, zone, storeZone], {
      storeId: 5,
      zoneId: 7,
    });
    expect(result?.id).toBe(4);
  });

  it('STORE_ZONE does not match when storeId or zoneId differ', () => {
    const storeZone = makePromo({ id: 4, scope: 'STORE_ZONE', storeId: 5, zoneId: 7 });
    const global = makePromo({ id: 1, scope: 'GLOBAL' });
    const result = resolveScopePriority([storeZone, global], { storeId: 5, zoneId: 99 });
    // Falls through to GLOBAL since STORE_ZONE doesn't match
    expect(result?.id).toBe(1);
  });

  it('inactive promos are ignored even if they would win on scope', () => {
    const inactiveStoreZone = makePromo({
      id: 4,
      scope: 'STORE_ZONE',
      storeId: 5,
      zoneId: 7,
      isActive: false,
    });
    const global = makePromo({ id: 1, scope: 'GLOBAL' });
    const result = resolveScopePriority([inactiveStoreZone, global], {
      storeId: 5,
      zoneId: 7,
    });
    expect(result?.id).toBe(1);
  });
});
