// src/modules/auth/decorator/currentUser.decorator.spec.ts
import { ExecutionContext } from '@nestjs/common';
import { extractUser } from './currentUser.decorator';

describe('CurrentUser Extractor', () => {
  it('should extract the user from the request object', () => {
    const mockUser = { id: 1, username: 'testUser' };
    const mockRequest = { user: mockUser };
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    const result = extractUser(null, mockContext as ExecutionContext);

    expect(result).toEqual(mockUser);
    expect(mockContext.switchToHttp).toHaveBeenCalled();
    expect(mockContext.switchToHttp?.().getRequest).toHaveBeenCalled();
  });

  it('should return undefined if user is not present in the request object', () => {
    const mockRequest = {};
    const mockContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    const result = extractUser(null, mockContext as ExecutionContext);

    expect(result).toBeUndefined();
    expect(mockContext.switchToHttp).toHaveBeenCalled();
    expect(mockContext.switchToHttp?.().getRequest).toHaveBeenCalled();
  });
});
