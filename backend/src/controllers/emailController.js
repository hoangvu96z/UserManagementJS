const emailService = require('../services/emailService');

const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html, from } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ error: 'Recipient, subject, and message content are required' });
    }

    const info = await emailService.sendEmail({ to, subject, text, html, from });

    res.json({
      message: 'Email sent successfully',
      info
    });
  } catch (error) {
    console.error('Send email error:', error);
    if (error.message && error.message.includes('configured')) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to send email' });
  }
};

module.exports = {
  sendEmail
};
