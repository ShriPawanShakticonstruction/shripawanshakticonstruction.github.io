const adminEmail = 'shripawanshakticonstruction@gmail.com';

const otpStore = globalThis.__spcOtpStore || {};
globalThis.__spcOtpStore = otpStore;

const companyStore = globalThis.__spcCompanyStore || {};
globalThis.__spcCompanyStore = companyStore;

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    if (event.path.includes('/send-otp')) {
      const email = (body.email || '').trim();
      if (!email || email !== adminEmail) {
        return json(401, { success: false, error: 'Unauthorized admin email.' });
      }

      const otp = '123456';
      otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
      return json(200, { success: true, message: 'OTP sent (demo mode). Use 123456 for testing.', otp });
    }

    if (event.path.includes('/verify-otp')) {
      const { email, otp } = body;
      const record = otpStore[email];

      if (!record || record.otp !== String(otp) || record.expiresAt < Date.now()) {
        return json(401, { success: false, error: 'Invalid OTP.' });
      }

      return json(200, { success: true, token: 'demo-admin-token' });
    }

    return json(404, { success: false, error: 'Not found' });
  } catch (error) {
    return json(500, { success: false, error: error.message || 'Server error' });
  }
};
