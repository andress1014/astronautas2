import { handlerResponse } from "./handler.response";

describe('handlerResponse', () => {
  it('should return the correct response object', () => {
    const data = { id: 1, name: 'Test', message: 'Remove this' };
    const statusCode = 200;
    const message = 'Success';

    const result = handlerResponse(data, statusCode, message);

    expect(result).toEqual({
      message: 'Success',
      data: { id: 1, name: 'Test' },
      statusCode: 200,
    });
  });

  it('should handle empty data correctly', () => {
    const data = {};
    const statusCode = 404;
    const message = 'Not Found';

    const result = handlerResponse(data, statusCode, message);

    expect(result).toEqual({
      message: 'Not Found',
      data: {},
      statusCode: 404,
    });
  });

  it('should handle data without a "message" property', () => {
    const data = { id: 2, name: 'Another Test' };
    const statusCode = 201;
    const message = 'Created';

    const result = handlerResponse(data, statusCode, message);

    expect(result).toEqual({
      message: 'Created',
      data: { id: 2, name: 'Another Test' },
      statusCode: 201,
    });
  });
});