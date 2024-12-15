import FormData = require('form-data'); // Import FormData with correct type definitions
import Mailgun from 'mailgun.js';
import { randomBytes } from 'crypto';
 import ejs from "ejs";
import EmailTemplate from '../entities/email-template';
import { BadRequestException } from '../utils/service-exceptions';
import dataSource from '../datasource/data-source';

export default class EmailService {


  sendWelcomeEmail = async (to: string) => {
    const mailgun = new Mailgun(FormData);
    // Initialize the mailgun client with API key and username
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY ?? "",
    });

    //Get the email template to send
    const template = await dataSource.getRepository(EmailTemplate).findOne({where:{type: "welcome"}})
    if (!template) {
      throw new BadRequestException("Something went wrong while sending the email")
    }
    mg.messages.create('sandbox20b7407ae3534b28b73c3d6d8efc29e3.mailgun.org', {
      from: template.from,
      to: to,
      subject: template.subject,
      text: template.body,
      // html: '<h1>Testing some Mailgun awesomeness!</h1>',
    })
      .then((msg) => console.log(msg)) // Logs response data
      .catch((err) => console.error(err)); // Logs any error
  };

  sendUserInvite = async (to: string,dummypword:string) => {
    const mailgun = new Mailgun(FormData);
    // Initialize the mailgun client with API key and username
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY ?? "",
    });

    //Get the email template to send
    const template = await dataSource.getRepository(EmailTemplate).findOne({where:{type: "invite"}})
    if (!template) {
      throw new BadRequestException("Something went wrong while sending the email")
    }

    const html = ejs.render(template.body.replace('{dummypword}', dummypword));
    mg.messages.create('sandbox20b7407ae3534b28b73c3d6d8efc29e3.mailgun.org', {
      from: template.from,
      to: to,
      subject: template.subject,
      //text: template.body,
       html,
    })
      .then((msg) => console.log(msg)) // Logs response data
      .catch((err) => console.error(err)); // Logs any error
  };

//   sendConfirmationEmail = async (to: string, name: string, userId: Types.ObjectId) => {
//     const mailgun = new Mailgun(FormData);
//     // Initialize the mailgun client with API key and username
//     const mg = mailgun.client({
//       username: 'api',
//       key: process.env.MAILGUN_API_KEY ?? "",
//     });

//     // Generate a unique token


//     //Get the email template to send
//     const template = await EmailTemplate.findOne({ type: "Confirmation" })
//     if (!template) {
//       throw new BadRequestException("Something went wrong while sending the email")
//     }
//     const token = randomBytes(20).toString('hex');

//     const record: Partial<IEmailConfirmation> = {
//       userId,
//       token,
//       expirationTime: new Date(Date.now() + 3600000)
//     }
//     const x = await EmailConfirmation.create(record);


//     const link = process.env.SERVER_URL + `/users/verify-email/${userId}/${token}`
//     const html = ejs.render(template.body.replace('{name}', name).replace('{verificationLink}', link));
//     mg.messages.create(process.env.MAILGUN_DOMAIN!, {
//       from: template.from,
//       to: to,
//       subject: template.subject,
//       // text: html,
//       html: html,
//     })
//       .then((msg) => console.log(msg)) // Logs response data
//       .catch((err) => console.error(err)); // Logs any error
//   };

//   sendForgotPasswordEmail = async (to: string, name: string, userId: Types.ObjectId) => {
//     const mailgun = new Mailgun(FormData);
//     // Initialize the mailgun client with API key and username
//     const mg = mailgun.client({
//       username: 'api',
//       key: process.env.MAILGUN_API_KEY ?? "",
//     });

//     // Generate a unique token


//     //Get the email template to send
//     const template = await EmailTemplate.findOne({ type: "forgotPassword" })
//     if (!template) {
//       throw new BadRequestException("Something went wrong while sending the email")
//     }
//     const token = randomBytes(20).toString('hex');

//     const record: Partial<IEmailConfirmation> = {
//       userId,
//       token,
//       expirationTime: new Date(Date.now() + 3600000)
//     }
//     const x = await EmailConfirmation.create(record);


//     const link = process.env.SERVER_URL + `/forgot-password?tkn=${token}`
//     const html = ejs.render(template.body.replace('{name}', name).replace('{passwordLink}', link));
//     mg.messages.create(process.env.MAILGUN_DOMAIN!, {
//       from: template.from,
//       to: to,
//       subject: template.subject,
//       // text: html,
//       html: html,
//     })
//       .then((msg) => console.log(msg)) // Logs response data
//       .catch((err) => console.error(err)); // Logs any error
//   };
}




