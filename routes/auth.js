const express = require('express');
const router = express.Router();
const regController = require('../controllers/authAccount');

router.post('/login', regController.login);
router.post('/register', regController.register);
router.post('/insertsong', regController.insert_song);
router.get('/updateform/:id', regController.update_form);
router.post('/update_product', regController.update_song);
router.get('/delete/:id', regController.delete);


/// export router module ////
module.exports = router;

