import { calculateYeast } from '../js/calculator.js';

describe('calculateYeast', () => {
    test('calculates normal yeast amount correctly (baseline)', () => {
        // Flour: 500g, Hours: 4, Temp: 70F
        // basePercent = 0.015
        // tempFactor = 2^((70 - 70) / 12.6) = 1
        // timeFactor = 2 / 4 = 0.5
        // expected: 500 * 0.015 * 0.5 / 1 = 3.75
        const yeast = calculateYeast(500, 4, 70);
        expect(yeast).toBeCloseTo(3.75, 4);
    });

    test('adjusts yeast based on time (longer time = less yeast)', () => {
        const shorterTimeYeast = calculateYeast(500, 4, 70);
        const longerTimeYeast = calculateYeast(500, 8, 70);
        expect(longerTimeYeast).toBeLessThan(shorterTimeYeast);
    });

    test('adjusts yeast based on temperature (higher temp = less yeast)', () => {
        const coolerTempYeast = calculateYeast(500, 4, 70);
        const warmerTempYeast = calculateYeast(500, 4, 80);
        expect(warmerTempYeast).toBeLessThan(coolerTempYeast);
    });

    test('enforces minimum yeast boundary of 0.1', () => {
        // Provide extreme conditions that result in < 0.1 yeast.
        // Flour: 100g, Hours: 24, Temp: 90F
        // yeastAmount will be very small, but Math.max should cap it at 0.1
        const yeast = calculateYeast(100, 24, 90);
        expect(yeast).toBe(0.1);
    });
});
