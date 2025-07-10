const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000; // frontend server port

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
});
