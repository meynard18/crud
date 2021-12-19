const express = require('express');
const req = require('express/lib/request');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('index');
});

router.get('/register', (req, res) => {
   res.render('registration');
});

router.get('/login', (req, res) => {
   res.render('index');
});
router.get('/', (req, res) => {
   res.render('addsong');
});

router.get('/', (req, res) => {
   res.render('list');
});

module.exports = router;
