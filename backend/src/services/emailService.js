const net = require('net');
const tls = require('tls');

class SMTPClient {
  constructor(options) {
    this.host = options.host;
    this.port = options.port;
    this.secure = options.secure;
    this.username = options.username;
    this.password = options.password;
    this.clientHostname = options.clientHostname || 'localhost';
    this.socket = null;
    this.buffer = '';
  }

  async connect() {
    const eventName = this.secure ? 'secureConnect' : 'connect';

    if (this.secure) {
      this.socket = tls.connect({
        host: this.host,
        port: this.port,
        rejectUnauthorized: false
      });
    } else {
      this.socket = net.createConnection({
        host: this.host,
        port: this.port
      });
    }

    await new Promise((resolve, reject) => {
      const onError = error => {
        this.socket?.removeListener(eventName, onConnect);
        reject(error);
      };

      const onConnect = () => {
        this.socket?.removeListener('error', onError);
        resolve();
      };

      this.socket.once(eventName, onConnect);
      this.socket.once('error', onError);
    });

    const greeting = await this._readResponse();
    if (greeting.code !== 220) {
      throw new Error(`SMTP server rejected connection: ${greeting.code} ${greeting.message}`);
    }
  }

  async close() {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }

  async sendCommand(command, expectedCodes) {
    if (!this.socket) {
      throw new Error('SMTP connection not established');
    }

    this.socket.write(`${command}\r\n`);
    const response = await this._readResponse();
    if (expectedCodes && ![].concat(expectedCodes).includes(response.code)) {
      throw new Error(`SMTP command failed (${command}): ${response.code} ${response.message}`);
    }
    return response;
  }

  async _readResponse() {
    return await new Promise((resolve, reject) => {
      const onData = chunk => {
        this.buffer += chunk.toString('utf8');

        const lines = this.buffer.split(/\r?\n/);
        const lastLine = lines[lines.length - 2]; // last element is '' after split

        if (lastLine && /^\d{3}[ -]/.test(lastLine)) {
          const code = parseInt(lastLine.slice(0, 3), 10);
          const finished = lastLine[3] === ' ';

          if (finished) {
            this.socket.removeListener('data', onData);
            this.socket.removeListener('error', onError);
            const message = lines
              .filter(line => /^\d{3}[ -]/.test(line))
              .map(line => line.slice(4))
              .join('\n')
              .trim();
            this.buffer = '';
            resolve({ code, message });
          }
        }
      };

      const onError = error => {
        this.socket.removeListener('data', onData);
        reject(error);
      };

      this.socket.on('data', onData);
      this.socket.once('error', onError);
    });
  }

  async authenticate() {
    if (!this.username || !this.password) {
      return;
    }

    await this.sendCommand('AUTH LOGIN', 334);
    await this.sendCommand(Buffer.from(this.username).toString('base64'), 334);
    await this.sendCommand(Buffer.from(this.password).toString('base64'), 235);
  }

  async sendMail({ from, to, subject, contentType, body }) {
    await this.connect();

    try {
      await this.sendCommand(`EHLO ${this.clientHostname}`, 250);
      await this.authenticate();

      await this.sendCommand(`MAIL FROM:<${from}>`, [250, 251]);

      const recipients = Array.isArray(to) ? to : [to];
      for (const recipient of recipients) {
        await this.sendCommand(`RCPT TO:<${recipient}>`, [250, 251]);
      }

      await this.sendCommand('DATA', 354);

      const headers = [
        `Subject: ${subject}`,
        `From: ${from}`,
        `To: ${recipients.join(', ')}`,
        `Date: ${new Date().toUTCString()}`,
        `MIME-Version: 1.0`,
        `Content-Type: ${contentType}; charset=utf-8`
      ];

      const normalizedBody = body
        .replace(/\r?\n/g, '\r\n')
        .replace(/(^|\n)\./g, '$1..');

      this.socket.write(`${headers.join('\r\n')}\r\n\r\n${normalizedBody}\r\n.\r\n`);

      const dataResponse = await this._readResponse();
      if (dataResponse.code !== 250) {
        throw new Error(`SMTP server rejected email body: ${dataResponse.code} ${dataResponse.message}`);
      }

      await this.sendCommand('QUIT', 221);
    } finally {
      await this.close();
    }
  }
}

class EmailService {
  constructor() {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
      SMTP_CLIENT_HOSTNAME
    } = process.env;

    this.config = {
      host: SMTP_HOST,
      port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : undefined,
      secure: SMTP_SECURE === 'true',
      username: SMTP_USER,
      password: SMTP_PASS,
      from: SMTP_FROM,
      clientHostname: SMTP_CLIENT_HOSTNAME || 'localhost'
    };
  }

  ensureConfigured() {
    if (!this.config.host) {
      throw new Error('SMTP_HOST is not configured');
    }
  }

  async sendEmail({ to, subject, text, html, from }) {
    this.ensureConfigured();

    if (!to || !subject || (!text && !html)) {
      throw new Error('Recipient, subject, and text or html body are required');
    }

    const recipients = Array.isArray(to) ? to : [to];
    const sender = from || this.config.from || this.config.username;

    if (!sender) {
      throw new Error('Sender email address is not configured');
    }

    const body = html || text;
    const contentType = html ? 'text/html' : 'text/plain';

    const client = new SMTPClient({
      host: this.config.host,
      port: this.config.port || (this.config.secure ? 465 : 587),
      secure: this.config.secure,
      username: this.config.username,
      password: this.config.password,
      clientHostname: this.config.clientHostname
    });

    await client.sendMail({
      from: sender,
      to: recipients,
      subject,
      contentType,
      body
    });

    return {
      to: recipients,
      subject,
      from: sender
    };
  }
}

module.exports = new EmailService();
