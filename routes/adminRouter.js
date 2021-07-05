const {Router} = require('express');
const adminController = require('../contollers/adminController');

const router = new Router();

router.post('/sign-in',adminController.signIn);
router.post('/change-email',adminController.authenticate,adminController.changeEmail);
router.post('/change-password',adminController.authenticate, adminController.changePassword);

module.exports = router;