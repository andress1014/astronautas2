export function handlerResponse<T>(
  data: T,
  statusCode: number,
  message: string
) {
  const { message: _, ...cleanedData } = (data as any);
  return {
    message,
    data: cleanedData,
    statusCode,
  };
}
