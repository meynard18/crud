const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000; /// process.env.PORT give available port option
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

/// this is how to instantiate express ///
const app = express();

// hbs //
app.set('view engine', 'hbs');

//setting route folder //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/registerRoutes'));

app.listen(port, () => {
   console.log('server-started', +port);
});
