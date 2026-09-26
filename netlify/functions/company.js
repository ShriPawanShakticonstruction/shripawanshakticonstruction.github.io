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
    const otp = String(body.otp || '');
    const record = otpStore[email];

    if (!record || !record.otp || record.otp !== otp || record.expiresAt < Date.now()) {
      return json(401, { success: false, error: 'Invalid OTP.' });
    }

    return json(200, { success: true, token: 'demo-admin-token' });
  } catch (error) {
    return json(500, { success: false, error: error.message || 'Server error' });
  }
};
