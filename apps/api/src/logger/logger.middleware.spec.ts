import { RequestLogger } from './logger.middleware';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new RequestLogger()).toBeDefined();
  });
});
