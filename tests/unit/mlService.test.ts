import { MLService } from '../../server/services/mlService.js';

describe('MLService', () => {
  let mlService: MLService;

  beforeEach(() => {
    mlService = new MLService();
  });

  describe('predict', () => {
    it('should predict line break from waveform data', async () => {
      const waveformData = {
        currentR: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000) * 50),
        currentY: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 2.09) * 50),
        currentB: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 4.18) * 50),
        voltageR: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000) * 230),
        voltageY: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 2.09) * 230),
        voltageB: Array.from({ length: 400 }, () => Math.sin(Date.now() / 1000 + 4.18) * 230),
        samplingRate: 10000,
        durationSeconds: 4.0,
      };

      const result = await mlService.predict(waveformData);

      expect(result).toHaveProperty('faultDetected');
      expect(result).toHaveProperty('faultType');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('severity');
      expect(result).toHaveProperty('detectionTimeMs');
      expect(result).toHaveProperty('features');
    });

    it('should handle invalid waveform data', async () => {
      const invalidData = {
        currentR: [],
        currentY: [],
        currentB: [],
        voltageR: [],
        voltageY: [],
        voltageB: [],
        samplingRate: 10000,
        durationSeconds: 4.0,
      };

      await expect(mlService.predict(invalidData)).rejects.toThrow();
    });
  });

  describe('getModelMetrics', () => {
    it('should return model performance metrics', async () => {
      const metrics = await mlService.getModelMetrics();

      expect(metrics).toHaveProperty('accuracy');
      expect(metrics).toHaveProperty('precision');
      expect(metrics).toHaveProperty('recall');
      expect(metrics).toHaveProperty('f1Score');
      expect(metrics).toHaveProperty('falsePositiveRate');
    });
  });

  describe('isReady', () => {
    it('should return model readiness status', () => {
      const isReady = mlService.isReady();
      expect(typeof isReady).toBe('boolean');
    });
  });
});
