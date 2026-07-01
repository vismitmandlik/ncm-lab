const crypto = require('crypto');

module.exports = function handler(req, res)
{
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST')
  {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const key = process.env.CIPHER_KEY;
  if (!key || key.length !== 16)
  {
    res.status(500).json({ error: 'CIPHER_KEY is not configured on the server.' });
    return;
  }

  const ciphertext = req.body && req.body.ciphertext;
  if (!ciphertext || typeof ciphertext !== 'string' || !ciphertext.trim())
  {
    res.status(400).json({ error: 'Missing or invalid "ciphertext" field.' });
    return;
  }

  try
  {
    const keyBuf    = Buffer.from(key, 'utf8');
    const encBuf    = Buffer.from(ciphertext.trim(), 'base64');
    const decipher  = crypto.createDecipheriv('aes-128-ecb', keyBuf, null);
    const decrypted = Buffer.concat([decipher.update(encBuf), decipher.final()]);
    res.status(200).json({ plaintext: decrypted.toString('utf8') });
  }
  catch (e)
  {
    res.status(400).json({ error: 'Decryption failed — wrong key or data is not AES-ECB-Base64.' });
  }
};
