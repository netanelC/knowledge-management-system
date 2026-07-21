import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../index';
import * as model from './model';

describe('Health API', () => {
  it('GET /api/health should return ok status, database connected, and storage connected', async () => {
    // Act
    const response = await request(app).get('/api/health');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      database: 'connected',
      storage: 'connected',
    });
  });

  it('GET /api/health should return error status and storage disconnected when S3 is down', async () => {
    // Arrange
    const spy = vi.spyOn(model, 'pingStorage').mockResolvedValue(false);

    // Act
    const response = await request(app).get('/api/health');

    // Assert
    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'error',
      database: 'connected',
      storage: 'disconnected',
    });

    spy.mockRestore();
  });
});
