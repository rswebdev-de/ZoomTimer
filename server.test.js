const request = require('supertest');
const path = require('path');

const app = require('./server');

describe('Server - Functional Tests', () => {
  describe('GET /health', () => {
    it('returns 200 with JSON health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Zoom Timer App is running',
      });
    });

    it('returns status field as "ok"', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('ok');
    });

    it('returns the correct message', async () => {
      const response = await request(app).get('/health');
      expect(response.body.message).toBe('Zoom Timer App is running');
    });
  });

  describe('GET * (SPA fallback)', () => {
    it('returns 200 for the root path', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    it('serves HTML content type for root', async () => {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toMatch(/html/);
    });

    it('returns 200 for unknown routes (SPA fallback)', async () => {
      const response = await request(app).get('/some/unknown/path');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });

    it('serves index.html content for arbitrary routes', async () => {
      const response = await request(app).get('/timer');
      expect(response.status).toBe(200);
      expect(response.text).toContain('html');
    });
  });

  describe('Static file serving', () => {
    it('serves files from the public directory', async () => {
      // The root route serves index.html from public
      const response = await request(app).get('/index.html');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  describe('HTTP methods', () => {
    it('health endpoint does not respond to POST', async () => {
      const response = await request(app).post('/health');
      // Express returns 404 for POST to a GET-only route
      expect(response.status).not.toBe(200);
    });

    it('health endpoint does not respond to PUT', async () => {
      const response = await request(app).put('/health');
      expect(response.status).not.toBe(200);
    });

    it('health endpoint does not respond to DELETE', async () => {
      const response = await request(app).delete('/health');
      expect(response.status).not.toBe(200);
    });
  });

  describe('Response headers', () => {
    it('health endpoint returns proper content-type', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('SPA fallback sets HTML content-type', async () => {
      const response = await request(app).get('/');
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });
  });
});
