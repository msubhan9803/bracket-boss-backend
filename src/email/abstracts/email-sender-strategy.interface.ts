export abstract class EmailSenderStrategy {
  abstract sendEmail(
    to: string,
    subject: string,
    body: string,
    data: Record<string, any>,
  ): Promise<void>;
}
