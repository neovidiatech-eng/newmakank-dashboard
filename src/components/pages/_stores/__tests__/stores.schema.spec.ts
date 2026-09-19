import { describe, it, expect } from 'vitest';
import { StoresSchema } from '../stores.schema';

describe('StoresSchema Validation Tests', () => {
  const mockT = (key: string) => key;
  const schema = StoresSchema(mockT as any, false);

  const baseValidData = {
    nameAr: 'مطعم الاختبار',
    nameEn: 'Test Restaurant',
    templateId: 1,
    address: 'شارع البحر، المحلة الكبرى',
    UserName: 'Store Admin',
    userEmail: 'teststore@example.com',
    userPhone: '01012345678',
    userPass: 'Password123!',
    map: {
      lat: 30.9706,
      lng: 31.1669,
    },
  };

  it('accepts valid store creation data with Mahalla map coordinates', () => {
    const result = schema.safeParse(baseValidData);
    expect(result.success).toBe(true);
  });

  it('rejects store creation when map location is missing', () => {
    const { map, ...withoutMap } = baseValidData;
    const result = schema.safeParse(withoutMap);
    expect(result.success).toBe(false);

    if (!result.success) {
      const mapError = result.error.issues.find(issue => issue.path[0] === 'map');
      expect(mapError).toBeDefined();
    }
  });

  it('rejects store creation when map coordinates are null or undefined', () => {
    const invalidMapData = {
      ...baseValidData,
      map: {
        lat: undefined,
        lng: undefined,
      },
    };
    const result = schema.safeParse(invalidMapData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const latError = result.error.issues.find(
        issue => issue.path[0] === 'map' && (issue.path[1] === 'lat' || issue.path.length === 1)
      );
      expect(latError).toBeDefined();
    }
  });

  it('accepts optional storeOrder as number or string', () => {
    const withNumericOrder = { ...baseValidData, storeOrder: 5 };
    expect(schema.safeParse(withNumericOrder).success).toBe(true);

    const withStringOrder = { ...baseValidData, storeOrder: '10' };
    expect(schema.safeParse(withStringOrder).success).toBe(true);
  });

  it('validates Egyptian phone number format', () => {
    const withInvalidPhone = { ...baseValidData, userPhone: '12345' };
    const result = schema.safeParse(withInvalidPhone);
    expect(result.success).toBe(false);

    if (!result.success) {
      const phoneError = result.error.issues.find(issue => issue.path[0] === 'userPhone');
      expect(phoneError).toBeDefined();
    }
  });
});
