export function handlerResponse<T>(data: T, status: number) {
    return {
      status,
      data,
    };
  }
  