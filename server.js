require('dotenv').config({ path: '.env.local' });

const express = require('express');
const decode  = require('./api/decode');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));
app.post('/api/decode', decode);

app.listen(PORT, function ()
{
  console.log('NCM Lab running at http://localhost:' + PORT);
});
