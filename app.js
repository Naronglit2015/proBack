require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notFound = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const authRoute = require('./routes/auth-route');
const authenticate = require('./middlewares/authenticate');

const app = express();

app.use(cors());
app.use(express.json());

// service
app.use('/auth', authRoute);

app.use('/useronly', authenticate, (req, res, next) => {
  res.json({ user: req.user });
});

// notFound
app.use(notFound);

// error
app.use(errorMiddleware);

let port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server on Port :', port));
