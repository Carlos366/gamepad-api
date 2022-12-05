const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Server Running on Port: http://localhost:${PORT}`))
  .catch((error) => console.log(`${error} did not connect`));

const app = express();
app.use(cors());

app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/lists', require('./routes/list'));
app.get('/', (req, res) => {
  res.send('App is running');
});

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log('Backend server is running!');
});
