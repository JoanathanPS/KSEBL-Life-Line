import request from 'supertest';
import { app } from '../../server/index.js';

describe('Events API Integration Tests', () => {
  let authToken: string;
  let testEventId: string;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@ksebl.gov.in',
        password: 'Admin@123',
      });

    authToken = loginResponse.body.data.tokens.accessToken;
  });

  describe('GET /api/v1/events', () => {
    it('should get events list with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/events')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('events');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should filter events by status', async () => {
      const response = await request(app)
        .get('/api/v1/events')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'detected' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should filter events by severity', async () => {
      const response = await request(app)
        .get('/api/v1/events')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ severity: 'high' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/v1/events/active', () => {
    it('should get active events', async () => {
      const response = await request(app)
        .get('/api/v1/events/active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('events');
    });
  });

  describe('POST /api/v1/events', () => {
    it('should create new event', async () => {
      const eventData = {
        feederId: 'test-feeder-123',
        confidenceScore: 0.85,
        estimatedLocationKm: 2.5,
        severity: 'high',
      };

      const response = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('event');
      
      testEventId = response.body.data.event.id;
    });
  });

  describe('POST /api/v1/events/:id/acknowledge', () => {
    it('should acknowledge event', async () => {
      if (!testEventId) {
        // Create a test event first
        const eventData = {
          feederId: 'test-feeder-123',
          confidenceScore: 0.85,
          estimatedLocationKm: 2.5,
          severity: 'high',
        };

        const createResponse = await request(app)
          .post('/api/v1/events')
          .set('Authorization', `Bearer ${authToken}`)
          .send(eventData);

        testEventId = createResponse.body.data.event.id;
      }

      const response = await request(app)
        .post(`/api/v1/events/${testEventId}/acknowledge`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.event.status).toBe('acknowledged');
    });
  });

  describe('POST /api/v1/events/:id/resolve', () => {
    it('should resolve event', async () => {
      if (!testEventId) {
        // Create and acknowledge a test event first
        const eventData = {
          feederId: 'test-feeder-123',
          confidenceScore: 0.85,
          estimatedLocationKm: 2.5,
          severity: 'high',
        };

        const createResponse = await request(app)
          .post('/api/v1/events')
          .set('Authorization', `Bearer ${authToken}`)
          .send(eventData);

        testEventId = createResponse.body.data.event.id;

        await request(app)
          .post(`/api/v1/events/${testEventId}/acknowledge`)
          .set('Authorization', `Bearer ${authToken}`);
      }

      const response = await request(app)
        .post(`/api/v1/events/${testEventId}/resolve`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ resolutionNotes: 'Test resolution' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.event.status).toBe('resolved');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all endpoints', async () => {
      const response = await request(app)
        .get('/api/v1/events');

      expect(response.status).toBe(401);
    });
  });
});
