const photoStore = globalThis.__spcPhotoStore || {};
globalThis.__spcPhotoStore = photoStore;

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event) => {
  try {
    const { key } = event.queryStringParameters || {};

    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'image/png' },
        body: photoStore[key] || '',
        isBase64Encoded: !!(photoStore[key] || '').startsWith('data:image/')
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      if (!body.key) return json(400, { success: false, error: 'Missing photo key.' });
      photoStore[body.key] = body.dataUrl || '';
      return json(200, { success: true, key: body.key });
    }

    return json(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return json(500, { success: false, error: error.message || 'Server error' });
  }
};
