import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TRANSFROM_IMAGE_URLS_KEY } from '../decorators/transform-image-urls.decorator';

@Injectable()
export class TransformImageUrlsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const transformImageUrls = this.reflector.get<string[]>(
      TRANSFROM_IMAGE_URLS_KEY,
      context.getHandler(),
    );
    if (!transformImageUrls) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const prefix = process.env.APP_UPLOADS_URL;
        return this.applyPrefix(data, transformImageUrls, prefix);
      }),
    );
  }

  private applyPrefix(data: any, fields: string[], prefix: string): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.applyPrefix(item, fields, prefix));
    } else if (typeof data === 'object' && data !== null) {
      fields.forEach((field) => {
        if (data[field]) {
          if (typeof data[field] === 'string') {
            data[field] = `${prefix}${data[field]}`;
          } else {
            data[field] = this.applyPrefix(data[field], fields, prefix);
          }
        }
      });
    }
    return data;
  }
}
