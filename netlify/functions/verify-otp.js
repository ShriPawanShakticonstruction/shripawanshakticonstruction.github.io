const adminEmail = 'shripawanshakticonstruction@gmail.com';

const otpStore = globalThis.__spcOtpStore || {};
globalThis.__spcOtpStore = otpStore;

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { success: false, error: 'Method not allowed' });

  try {
    const body = JSON.parse(event.body || '{}');
    const email = (body.email || '').trim();

    if (!email || email !== adminEmail) {
      return json(401, { success: false, error: 'Unauthorized admin email.' });
    }

    const otp = '123456';
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    return json(200, { success: true, message: 'OTP sent (demo mode). Use 123456 for testing.', otp });
  } catch (error) {
    return json(500, { success: false, error: error.message || 'Server error' });
  }
};
