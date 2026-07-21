import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';

vi.mock('../../utils/s3', () => ({
  pingS3: vi.fn().mockResolvedValue(true),
}));

describe('Health API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/health should return ok status, database connected, and s3 connected', async () => {
    // Arrange
    // (mock setup done in beforeEach)

    // Act
    const response = await request(app).get('/api/health');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('database', 'connected');
    expect(response.body).toHaveProperty('s3', 'connected');
    expect(response.body).toHaveProperty('time');
  });
});
