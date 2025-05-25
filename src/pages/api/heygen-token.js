export default async function handler(req, res) {
  const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
  const baseApiUrl = 'https://api.heygen.com';

  if (!HEYGEN_API_KEY) {
    return res.status(500).send('API key is missing');
  }

  const response = await fetch(`${baseApiUrl}/v1/streaming.create_token`, {
    method: 'POST',
    headers: {
      'x-api-key': HEYGEN_API_KEY,
    },
  });

  const data = await response.json();
  if (!data.data?.token) {
    return res.status(500).send('Failed to get token');
  }

  // Trả về plain text token, không phải JSON object
  res.status(200).send(data.data.token);
}
