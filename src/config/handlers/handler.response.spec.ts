import { handlerResponse } from "./handler.response";

describe('handlerResponse', () => {
  it('should return an object with the provided data and status', () => {
    const data = { message: 'Success' };
    const status = 200;

    const result = handlerResponse(data, status);

    expect(result).toEqual({
      status,
      data,
    });
  });

  it('should handle different types of data', () => {
    const data = [1, 2, 3];
    const status = 201;

    const result = handlerResponse(data, status);

    expect(result).toEqual({
      status,
      data,
    });
  });

  it('should handle null data', () => {
    const data = null;
    const status = 404;

    const result = handlerResponse(data, status);

    expect(result).toEqual({
      status,
      data,
    });
  });

  it('should handle undefined data', () => {
    const data = undefined;
    const status = 500;

    const result = handlerResponse(data, status);

    expect(result).toEqual({
      status,
      data,
    });
  });
});