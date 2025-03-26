import { ProductListener } from "./product.listener";

describe('ProductListener', () => {
  let productListener: ProductListener;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    productListener = new ProductListener();
    loggerSpy = jest.spyOn(productListener['logger'], 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log a message when handleProductCreated is called', () => {
    const payload = { productId: '12345' };

    productListener.handleProductCreated(payload);

    expect(loggerSpy).toHaveBeenCalledWith('📦 Producto creado con ID: 12345');
  });
});