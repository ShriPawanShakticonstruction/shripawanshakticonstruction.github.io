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
  try {
    if (event.httpMethod === 'GET') {
      return json(200, companyStore);
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      Object.assign(companyStore, body);
      return json(200, { success: true, data: companyStore });
    }

    return json(405, { success: false, error: 'Method not allowed' });
  } catch (error) {
    return json(500, { success: false, error: error.message || 'Server error' });
  }
};
