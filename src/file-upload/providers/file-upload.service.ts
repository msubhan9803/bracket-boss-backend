import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = path.resolve('uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: FileUpload): Promise<{ url: string }> {
    const { createReadStream, filename } = file;
    const stream = createReadStream();
    const key = `${uuidv4()}-${filename}`.replace(/ /g, '_');
    const filePath = path.join(this.uploadDir, key);

    return new Promise((resolve) => {
      const writeStream = fs.createWriteStream(filePath);

      stream
        .pipe(writeStream)
        .on('finish', () => resolve({ url: key }))
        .on('error', (error) => {
          throw new BadRequestException(`Error uploading file: ${error}`);
        });
    });
  }
}
