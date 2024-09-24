import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { FileUploadService } from './providers/file-upload.service';
import { UploadFileResponseDto } from './dtos/upload-file-response.dto';

@Resolver()
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => UploadFileResponseDto)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<UploadFileResponseDto> {
    return this.fileUploadService.uploadFile(file);
  }
}
