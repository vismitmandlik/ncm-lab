const SnappyJS = require('snappyjs');

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

  try
  {
    // Vert.x encodes byte[] as Base64URL (no padding) — Buffer handles both variants
    var buf         = Buffer.from(data.trim(), 'base64');
    var decompressed = SnappyJS.uncompress(buf);
    var text        = Buffer.from(decompressed).toString('utf8');

    // Try to parse as JSON so the UI can pretty-print it
    try
    {
      res.status(200).json({ result: text, json: JSON.parse(text) });
    }
    catch (e)
    {
      res.status(200).json({ result: text });
    }
  }
  catch (e)
  {
    res.status(400).json({ error: 'Decompression failed — data may not be Snappy-compressed.' });
  }
};
