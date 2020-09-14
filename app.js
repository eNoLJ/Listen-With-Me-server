const express = require('express');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sessionConfiguration = require('./controller/users/Oauth/session-config');
const passportConfiguration = require('./controller/users/Oauth/passport-config');
const dotenv = require('dotenv');

dotenv.config();
sessionConfiguration(app);
passportConfiguration(app);

const usersRouter = require('./routes/users');
const playlistsRouter = require('./routes/playlists');
const rootRouter = require('./routes/root');
const roomsRouter = require('./routes/rooms');

//cors configuration
const cors = require('cors');
const whitelist = ['*'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'origin, content-type, authorization, token',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};


// DB sync check
const models = require('./models/index.js');
models.sequelize
  .sync()
  .then(() => {
    console.log('DB connection success');
  })
  .catch((err) => {
    console.log('**DB connection fail**');
    console.log(err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});
 
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use('/', rootRouter);
app.use('/user', usersRouter);
app.use('/playlist', playlistsRouter);
app.use('/room', roomsRouter);

module.exports = app;