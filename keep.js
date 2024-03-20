const express = require('express');

const app = express();

app.get('/',async(req, res) => {
  await res.send('Hello Express app!')
  await console.log('Uptimer Working...');
});

app.listen(3000,async () => {
  //await console.log('server started');
});