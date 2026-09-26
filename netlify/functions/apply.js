const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      applicationType = 'work',
      fullName,
      phone,
      email,
      city,
      experience,
      speciality,
      message,
      resumeName,
      resumeData
    } = body;

    if (!fullName || !phone || !email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Name, phone and email are required.' })
      };
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const toEmail = process.env.COMPANY_EMAIL || user;

    if (!user || !pass) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Gmail credentials are not configured on Netlify.' })
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const attachment = resumeData
      ? [{
          filename: resumeName || `${applicationType}-${Date.now()}.pdf`,
          content: Buffer.from(resumeData, 'base64')
        }]
      : [];

    const subject = applicationType === 'job'
      ? 'New Job Application - Shri Pawan Shakti Construction'
      : 'New Work Application - Shri Pawan Shakti Construction';

    const details = [
      `Application Type: ${applicationType === 'job' ? 'Job' : 'Work'}`,
      `Full Name: ${fullName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `City / Area: ${city || 'Not provided'}`,
      `Experience / Qualification: ${experience || 'Not provided'}`,
      `Speciality / Job Role: ${speciality || 'Not provided'}`,
      `Message: ${message || 'No message provided'}`
    ].join('<br>');

    await transporter.sendMail({
      from: `Shri Pawan Shakti Construction <${user}>`,
      to: toEmail,
      replyTo: email,
      subject,
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.6; color:#111;">
          <h2 style="margin-bottom:12px;">${subject}</h2>
          <p>New applicant details are below:</p>
          <div style="background:#f7f3eb; border:1px solid #e8e2d8; padding:16px; border-radius:12px;">
            ${details}
          </div>
        </div>
      `,
      attachments: attachment
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Application sent successfully.' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message || 'Internal server error' })
    };
  }
};
