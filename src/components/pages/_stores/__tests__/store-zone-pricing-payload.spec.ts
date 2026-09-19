import { describe, it, expect } from 'vitest';

describe('Dashboard Store Zone Pricing Logic Tests', () => {
  function prepareZonePricesPayload(editedPrices: Record<number, string>) {
    return Object.entries(editedPrices)
      .filter(([, val]) => val.trim() !== '' && !isNaN(Number(val)))
      .map(([zoneId, price]) => ({
        zoneId: Number(zoneId),
        price: Number(price),
      }));
  }

  it('formats valid zone pricing entries correctly for API submission', () => {
    const edited = {
      1: '25',
      2: '30.5',
      3: '0',
    };

    const payload = prepareZonePricesPayload(edited);

    expect(payload).toEqual([
      { zoneId: 1, price: 25 },
      { zoneId: 2, price: 30.5 },
      { zoneId: 3, price: 0 },
    ]);
  });

  it('filters out empty strings and non-numeric inputs', () => {
    const edited = {
      1: '20',
      2: '',
      3: 'abc',
      4: '  ',
    };

    const payload = prepareZonePricesPayload(edited);

    expect(payload).toEqual([
      { zoneId: 1, price: 20 },
    ]);
  });

  it('returns empty array when no prices are set', () => {
    const payload = prepareZonePricesPayload({});
    expect(payload).toHaveLength(0);
  });
});
