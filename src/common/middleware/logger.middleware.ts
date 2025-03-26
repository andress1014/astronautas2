import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();
    const userAgent = req.get('user-agent') || '';

    console.log(`[${timestamp}] ${method} ${originalUrl} - ${userAgent}`);
    
    next();
  }
}
