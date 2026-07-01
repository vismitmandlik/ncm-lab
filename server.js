require('dotenv').config({ path: '.env.local' });

const express    = require('express');
const decrypt    = require('./api/decrypt');
const decompress = require('./api/decompress');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));
app.post('/api/decrypt',    decrypt);
app.post('/api/decompress', decompress);

app.listen(PORT, function ()
{
  console.log('NCM Lab running at http://localhost:' + PORT);
});
