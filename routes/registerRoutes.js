const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.render('index');
});

router.get('/register', (req, res) => {
   res.render('registration');
});
router.get('/', (req, res) => {
   res.render('addsong');
});

router.get('/', (req, res) => {
   res.render('list');
});

module.exports = router;
