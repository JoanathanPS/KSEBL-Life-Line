import request from 'supertest';
import { app } from '../../server/index.js';

describe('Dashboard API Integration Tests', () => {
  let authToken: string;

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

  describe('GET /api/v1/dashboard/summary', () => {
    it('should get dashboard summary data', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('overview');
      expect(response.body.data).toHaveProperty('recentEvents');
      expect(response.body.data).toHaveProperty('alerts');
      expect(response.body.data).toHaveProperty('performance');
    });

    it('should include correct overview metrics', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      const overview = response.body.data.overview;
      expect(overview).toHaveProperty('totalSubstations');
      expect(overview).toHaveProperty('activeFeeders');
      expect(overview).toHaveProperty('totalEventsToday');
      expect(overview).toHaveProperty('activeEvents');
      expect(overview).toHaveProperty('resolvedEvents');
      expect(overview).toHaveProperty('modelAccuracy');
    });

    it('should include recent events', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(Array.isArray(response.body.data.recentEvents)).toBe(true);
    });
  });

  describe('GET /api/v1/dashboard/map-data', () => {
    it('should get map data for substations', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/map-data')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('substations');
      expect(Array.isArray(response.body.data.substations)).toBe(true);
    });

    it('should include substation location data', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/map-data')
        .set('Authorization', `Bearer ${authToken}`);

      const substations = response.body.data.substations;
      if (substations.length > 0) {
        const substation = substations[0];
        expect(substation).toHaveProperty('id');
        expect(substation).toHaveProperty('name');
        expect(substation).toHaveProperty('code');
        expect(substation).toHaveProperty('lat');
        expect(substation).toHaveProperty('lng');
        expect(substation).toHaveProperty('voltageLevel');
        expect(substation).toHaveProperty('capacityMva');
        expect(substation).toHaveProperty('activeEvents');
      }
    });
  });

  describe('Authentication', () => {
    it('should require authentication for dashboard endpoints', async () => {
      const summaryResponse = await request(app)
        .get('/api/v1/dashboard/summary');

      const mapResponse = await request(app)
        .get('/api/v1/dashboard/map-data');

      expect(summaryResponse.status).toBe(401);
      expect(mapResponse.status).toBe(401);
    });
  });
});
