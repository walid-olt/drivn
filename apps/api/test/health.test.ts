import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.ts';

describe('Health Check', () => {
  const app = createApp();

  it('GET /health should return 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({data:{ status: 'ok' }});
  });
});
