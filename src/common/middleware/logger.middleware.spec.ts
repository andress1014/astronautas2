import { LoggerMiddleware } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();
    mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      get: jest.fn().mockReturnValue('test-user-agent'),
    };
    mockResponse = {};
    mockNextFunction = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log the request details', () => {
    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] GET \/test - test-user-agent/
      )
    );
  });

  it('should call the next function', () => {
    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction
    );

    expect(mockNextFunction).toHaveBeenCalled();
  });
});