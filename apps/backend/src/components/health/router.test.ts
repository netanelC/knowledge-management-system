import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index';

describe('Health API', () => {
  it('GET /api/health should return ok status and database connected', async () => {
    // Arrange

    // Act
    const response = await request(app).get('/api/health');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('database', 'connected');
    expect(response.body).toHaveProperty('time');
    expect(response.body).toHaveProperty('dbPingResult', 1);
  });
});
