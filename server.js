import express from 'express';
import webpackMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
const app = express();
const bodyParser = require('body-parser');
app.use(webpackMiddleware(webpack(webpackConfig)));
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(express.static("client"));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log('Port: ', port);
});
