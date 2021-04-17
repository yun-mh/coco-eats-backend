import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVariable, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    emailVariables: EmailVariable[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append('from', `Coco Eats <mailgun@${this.options.domain}>`);
    form.append('to', 'canivas@naver.com'); // mailgun無料利用のため、認証済みのアドレス宛にしか送信できない。
    form.append('subject', subject);
    form.append('template', template);
    emailVariables.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('アカウント認証のお願い', 'account_confirm', [
      { key: 'username', value: email },
      { key: 'code', value: code },
    ]);
  }
}
