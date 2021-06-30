const {Router} = require('express');
const adminController = require('../contollers/adminController');

const router = new Router();

router.post('/sign-in',adminController.signIn);
router.post('/change-email',adminController.changeEmail);

module.exports = router;