const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const User = require('../controllers/user');
const validate = require('../middlewares/validator');
const Vediomark = require('../controllers/vediomark');

const router = express.Router();

const upload = multer().single('profileImage');

//INDEX
router.get('/', User.index);

//STORE
router.post('/', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, User.store);

//SHOW
router.get('/:id',User.show);

//UPDATE
router.put('/:id', User.update);

//DELETE
router.delete('/:id', User.destroy);

//USERADMIN
router.post('/admin/:id', User.makeadmin);

//Vediodonemark
router.post('/vediomark',[
    check('userId').not().isEmpty().withMessage({success:false,message:'UserId is required'}),
    check('vedioId').not().isEmpty().withMessage({success:false,message:'vedioId is required'})
], validate, Vediomark.vediomarkdone)

//vediodoneunmark
router.post('/vediounmark',[
    check('userId').not().isEmpty().withMessage({success:false,message:'UserId is required'}),
    check('vedioId').not().isEmpty().withMessage({success:false,message:'vedioId is required'})
], validate, Vediomark.vedioumarkdone)

module.exports = router;