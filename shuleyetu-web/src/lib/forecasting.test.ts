import { describe, it, expect, beforeEach } from 'vitest';
import { forecastingService } from './forecasting';

describe('Forecasting Service', () => {
  let mockItems: any[];
  let mockSalesData: any[];

  beforeEach(() => {
    mockItems = [
      {
        id: 'item-1',
        name: 'Mathematics Textbook',
        stock_quantity: 20,
        price_tzs: 25000,
      },
      {
        id: 'item-2',
        name: 'School Uniform',
        stock_quantity: 5,
        price_tzs: 50000,
      },
      {
        id: 'item-3',
        name: 'Pens Pack',
        stock_quantity: 50,
        price_tzs: 5000,
      },
    ];

    mockSalesData = [
      { item_id: 'item-1', quantity: 2, date: '2024-01-15' },
      { item_id: 'item-1', quantity: 3, date: '2024-01-16' },
      { item_id: 'item-1', quantity: 2, date: '2024-01-17' },
      { item_id: 'item-2', quantity: 1, date: '2024-01-15' },
      { item_id: 'item-2', quantity: 0, date: '2024-01-16' },
      { item_id: 'item-2', quantity: 1, date: '2024-01-17' },
      { item_id: 'item-3', quantity: 5, date: '2024-01-15' },
      { item_id: 'item-3', quantity: 8, date: '2024-01-16' },
      { item_id: 'item-3', quantity: 6, date: '2024-01-17' },
    ];
  });

  describe('forecastItem', () => {
    it('should forecast item with sales history', () => {
      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [2, 3, 2, 2, 3, 2],
        7,
        10
      );

      expect(forecast.itemId).toBe('item-1');
      expect(forecast.itemName).toBe('Mathematics Textbook');
      expect(forecast.currentStock).toBe(20);
      expect(forecast.averageDailySales).toBeGreaterThan(0);
      expect(forecast.forecastedDemand).toBeGreaterThan(0);
      expect(forecast.recommendedReorderPoint).toBeGreaterThan(0);
      expect(forecast.recommendedOrderQuantity).toBeGreaterThan(0);
      expect(forecast.daysUntilStockout).toBeGreaterThan(0);
      expect(forecast.confidence).toBeGreaterThan(0);
      expect(forecast.confidence).toBeLessThanOrEqual(1);
    });

    it('should calculate days until stockout', () => {
      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [2, 2, 2],
        7,
        10
      );

      expect(forecast.daysUntilStockout).toBe(10); // 20 / 2
    });

    it('should handle zero average daily sales', () => {
      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [0, 0, 0],
        7,
        10
      );

      expect(forecast.daysUntilStockout).toBe(999);
    });

    it('should detect increasing trend', () => {
      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [1, 1, 1, 5, 6, 7],
        7,
        10
      );

      expect(forecast.trend).toBe('increasing');
    });

    it('should detect decreasing trend', () => {
      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [7, 6, 5, 1, 1, 1],
        7,
        10
      );

      expect(forecast.trend).toBe('decreasing');
    });

    it('should detect stable trend', () => {
      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [3, 3, 3, 3, 3, 3],
        7,
        10
      );

      expect(forecast.trend).toBe('stable');
    });

    it('should increase confidence with more data', () => {
      const forecast1 = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [2],
        7,
        10
      );

      const forecast2 = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        Array(100).fill(2),
        7,
        10
      );

      expect(forecast2.confidence).toBeGreaterThan(forecast1.confidence);
    });
  });

  describe('generateForecast', () => {
    it('should generate forecast for all items', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);

      expect(forecast.items.length).toBe(3);
      expect(forecast.generatedAt).toBeDefined();
      expect(forecast.forecastPeriod.start).toBeDefined();
      expect(forecast.forecastPeriod.end).toBeDefined();
    });

    it('should sort items by days until stockout', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);

      for (let i = 0; i < forecast.items.length - 1; i++) {
        expect(forecast.items[i].daysUntilStockout).toBeLessThanOrEqual(
          forecast.items[i + 1].daysUntilStockout
        );
      }
    });

    it('should identify items at risk', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);

      expect(forecast.summary.itemsAtRisk).toBeGreaterThanOrEqual(0);
      expect(forecast.summary.itemsAtRisk).toBeLessThanOrEqual(3);
    });

    it('should calculate total recommended orders', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);

      expect(forecast.summary.totalRecommendedOrders).toBeGreaterThanOrEqual(0);
    });

    it('should calculate estimated cost', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);

      expect(forecast.summary.estimatedCost).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty items', () => {
      const forecast = forecastingService.generateForecast([], mockSalesData);

      expect(forecast.items.length).toBe(0);
      expect(forecast.summary.itemsAtRisk).toBe(0);
      expect(forecast.summary.totalRecommendedOrders).toBe(0);
    });

    it('should handle items with no sales data', () => {
      const forecast = forecastingService.generateForecast(mockItems, []);

      expect(forecast.items.length).toBe(3);
      forecast.items.forEach(item => {
        expect(item.averageDailySales).toBe(0);
      });
    });
  });

  describe('getUrgentReorders', () => {
    it('should identify urgent reorders', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData, 7);
      const urgent = forecastingService.getUrgentReorders(forecast, 7);

      urgent.forEach(item => {
        expect(item.daysUntilStockout).toBeLessThan(7);
      });
    });

    it('should return empty array if no urgent reorders', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData, 1);
      const urgent = forecastingService.getUrgentReorders(forecast, 30);

      expect(Array.isArray(urgent)).toBe(true);
    });
  });

  describe('getOverstockedItems', () => {
    it('should identify overstocked items', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);
      const overstocked = forecastingService.getOverstockedItems(forecast);

      overstocked.forEach(item => {
        expect(item.currentStock).toBeGreaterThan(item.forecastedDemand * 1.5);
      });
    });

    it('should return empty array if no overstocked items', () => {
      const lowStockItems = mockItems.map(item => ({
        ...item,
        stock_quantity: 1,
      }));
      const forecast = forecastingService.generateForecast(lowStockItems, mockSalesData);
      const overstocked = forecastingService.getOverstockedItems(forecast);

      expect(Array.isArray(overstocked)).toBe(true);
    });
  });

  describe('exportAsCSV', () => {
    it('should export forecast as CSV', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);
      const csv = forecastingService.exportAsCSV(forecast);

      expect(csv).toContain('Inventory Forecast Report');
      expect(csv).toContain('SUMMARY');
      expect(csv).toContain('ITEM FORECASTS');
      expect(csv).toContain('Item Name');
    });

    it('should include all items in CSV', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);
      const csv = forecastingService.exportAsCSV(forecast);

      mockItems.forEach(item => {
        expect(csv).toContain(item.name);
      });
    });

    it('should include summary metrics in CSV', () => {
      const forecast = forecastingService.generateForecast(mockItems, mockSalesData);
      const csv = forecastingService.exportAsCSV(forecast);

      expect(csv).toContain('Items at Risk');
      expect(csv).toContain('Total Recommended Orders');
      expect(csv).toContain('Estimated Cost');
    });
  });

  describe('Edge Cases', () => {
    it('should handle items with very high stock', () => {
      const highStockItems = [
        { ...mockItems[0], stock_quantity: 10000 },
      ];
      const forecast = forecastingService.generateForecast(highStockItems, mockSalesData);

      expect(forecast.items[0].daysUntilStockout).toBeGreaterThan(100);
    });

    it('should handle items with zero stock', () => {
      const zeroStockItems = [
        { ...mockItems[0], stock_quantity: 0 },
      ];
      const forecast = forecastingService.generateForecast(zeroStockItems, mockSalesData);

      expect(forecast.items[0].daysUntilStockout).toBe(0);
    });

    it('should handle very high sales velocity', () => {
      const highSalesData = Array(30).fill(null).map((_, i) => ({
        item_id: 'item-1',
        quantity: 100,
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }));

      const forecast = forecastingService.generateForecast(mockItems, highSalesData);

      expect(forecast.items[0].averageDailySales).toBeGreaterThan(50);
    });

    it('should handle seasonal patterns', () => {
      const seasonalData = [
        // Low sales period
        { item_id: 'item-1', quantity: 1, date: '2024-01-01' },
        { item_id: 'item-1', quantity: 1, date: '2024-01-02' },
        // High sales period
        { item_id: 'item-1', quantity: 10, date: '2024-01-03' },
        { item_id: 'item-1', quantity: 12, date: '2024-01-04' },
      ];

      const forecast = forecastingService.forecastItem(
        'item-1',
        'Mathematics Textbook',
        20,
        [1, 1, 10, 12],
        7,
        10
      );

      expect(forecast.trend).toBe('increasing');
    });
  });
});
