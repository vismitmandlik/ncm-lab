const SnappyJS = require('snappyjs');
const crypto   = require('crypto');

function trySnappy(buf)
{
  var decompressed = SnappyJS.uncompress(buf);
  return Buffer.from(decompressed).toString('utf8');
}

function tryAES(buf, key)
{
  var keyBuf    = Buffer.from(key, 'utf8');
  var decipher  = crypto.createDecipheriv('aes-128-ecb', keyBuf, null);
  var decrypted = Buffer.concat([decipher.update(buf), decipher.final()]);
  var text      = decrypted.toString('utf8');
  if (!text) { throw new Error('empty result'); }
  return text;
}

module.exports = function handler(req, res)
{
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST')
  {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const data = req.body && req.body.data;
  if (!data || typeof data !== 'string' || !data.trim())
  {
    res.status(400).json({ error: 'Missing or invalid "data" field.' });
    return;
  }

  const key = process.env.CIPHER_KEY;
  var buf   = Buffer.from(data.trim(), 'base64');
  var text  = null;
  var method = null;

  // 1. Try Snappy first — used by CodecUtil.compress() for all API-returned fields
  try
  {
    text   = trySnappy(buf);
    method = 'snappy';
  }
  catch (e) { /* fall through */ }

  // 2. Try AES-ECB — used by CipherUtil for DB-level sensitive fields
  if (!text && key && key.length === 16)
  {
    try
    {
      text   = tryAES(buf, key);
      method = 'aes-ecb';
    }
    catch (e) { /* fall through */ }
  }

  if (!text)
  {
    res.status(400).json({ error: 'Could not decode — data is neither Snappy-compressed nor AES-ECB-encrypted, or the key is wrong.' });
    return;
  }

  // Pretty-print if valid JSON
  var json = null;
  try { json = JSON.parse(text); } catch (e) { /* plain text */ }

  res.status(200).json(
  {
    result: json ? JSON.stringify(json, null, 2) : text,
    method: method
  });
};
