require('dotenv').config({ path: '.env.local' });

const express = require('express');
const decrypt = require('./api/decrypt');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));
app.post('/api/decrypt', decrypt);

app.listen(PORT, function ()
{
  console.log('NCM Lab running at http://localhost:' + PORT);
});
