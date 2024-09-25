import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { TransformImageUrlsInterceptor } from '../interceptors/transform-image-urls.interceptor';

export const TRANSFROM_IMAGE_URLS_KEY = 'trasform-image-urls';
export function TransformImageUrls(...fields: string[]) {
  return applyDecorators(
    SetMetadata(TRANSFROM_IMAGE_URLS_KEY, fields),
    UseInterceptors(TransformImageUrlsInterceptor),
  );
}
