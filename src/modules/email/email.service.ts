import { Injectable } from '@nestjs/common';
import client from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';
import { EmailRepository } from './email.repository';
import * as brevo from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;
  constructor(
    private readonly configService: ConfigService,
    private readonly emailRepository: EmailRepository,
  ) {
    const apiKeyBrevo = this.configService.get<string>('BREVO_API_KEY');
    if (!apiKeyBrevo) {
      throw new Error('La clave API de Brevo no está configurada');
    }

    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKeyBrevo,
    );
  }

  async sendEmail(msg: Record<string, string | unknown>) {
    const apiKeySendGrid: string = <string>(
      this.configService.get<string>('SENDGRID_API_KEY')
    );
    const aditionalData = <Record<string, unknown>>msg.recipient;
    const recipient = <string>aditionalData.emailAddress;
    const message = <string>msg.body;
    const subject = <string>msg.subject;

    if (!recipient || typeof recipient !== 'string') {
      throw new Error(
        'El destinatario (recipient) es obligatorio y debe ser una cadena válida.',
      );
    }

    const isValidEmail = (email: string): boolean =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(recipient)) {
      throw new Error(
        `El destinatario "${recipient}" no es un correo electrónico válido.`,
      );
    }

    client.setApiKey(apiKeySendGrid);

    const messageData = {
      to: recipient,
      from: {
        email: 'reply@t-soluciono.com',
        name: 'T-Soluciono',
      },
      subject: subject,
      html: message,
    };

    try {
      const data = await client.send(messageData);
      console.info('Mail sent successfully', data);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendEmailBrevo(msg: Record<string, string | unknown>) {
    try {
      const aditionalData = <Record<string, unknown>>msg.recipient;
      const email = <string>aditionalData.emailAddress;
      const userName = <string>aditionalData.userName;
      const message = <string>msg.body;
      const subject = <string>msg.subject;

      if (!email || typeof email !== 'string') {
        throw new Error(
          'El destinatario (recipient) es obligatorio y debe ser una cadena válida.',
        );
      }

      const isValidEmail = (email: string): boolean =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isValidEmail(email)) {
        throw new Error(
          `El destinatario "${email}" no es un correo electrónico válido.`,
        );
      }

      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.to = [{ email: email, name: userName }];
      sendSmtpEmail.htmlContent = message;
      sendSmtpEmail.sender = {
        email: 'noreply@t-soluciono.com',
        name: 'T-Soluciono',
      };

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(result);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
