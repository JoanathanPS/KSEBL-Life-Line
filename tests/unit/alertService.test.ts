import { AlertService } from '../../server/services/alertService.js';

describe('AlertService', () => {
  let alertService: AlertService;

  beforeEach(() => {
    alertService = new AlertService();
  });

  describe('sendEventAlerts', () => {
    it('should send alerts for line break event', async () => {
      const eventData = {
        eventId: 'test-event-123',
        feederId: 'test-feeder-123',
        detectedAt: new Date().toISOString(),
        estimatedLocationKm: 2.5,
        severity: 'high',
        confidenceScore: 0.85,
        faultType: 'LINE_BREAK',
      };

      // Mock the database calls
      jest.spyOn(alertService as any, 'getEventDetails').mockResolvedValue({
        feederName: 'Test Feeder',
        feederCode: 'TEST-F01',
        substationName: 'Test Substation',
        substationCode: 'TEST-SS-001',
      });

      jest.spyOn(alertService as any, 'getAlertRecipients').mockResolvedValue([
        {
          id: 'user-123',
          email: 'test@example.com',
          phone: '+1234567890',
          fullName: 'Test User',
          role: 'operator',
        },
      ]);

      const results = await alertService.sendEventAlerts(eventData);

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getServiceStatus', () => {
    it('should return service configuration status', () => {
      const status = alertService.getServiceStatus();

      expect(status).toHaveProperty('email');
      expect(status).toHaveProperty('sms');
      expect(typeof status.email).toBe('boolean');
      expect(typeof status.sms).toBe('boolean');
    });
  });

  describe('sendTestAlert', () => {
    it('should send test alert to specified email', async () => {
      const testEmail = 'test@example.com';
      const testPhone = '+1234567890';

      // Mock the sendAlertsToRecipient method
      jest.spyOn(alertService as any, 'sendAlertsToRecipient').mockResolvedValue([
        {
          type: 'email',
          recipient: testEmail,
          status: 'sent',
          messageId: 'test-message-id',
        },
      ]);

      const results = await alertService.sendTestAlert(testEmail, testPhone);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
