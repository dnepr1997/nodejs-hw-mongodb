import nodemailer from 'nodemailer';
import 'dotenv/config';
import { getEnvVar } from './getEnvVar.js';

const host = getEnvVar('SMTP_HOST');
const pass = getEnvVar('SMTP_PASSWORD');
const port = getEnvVar('SMTP_PORT');
const user = getEnvVar('SMTP_USER');

const nodemailerConfig = {
  host: host,
  port: port,
  auth: {
    user: user,
    pass: pass,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (options) => {
  return await transport.sendMail(options);
};
