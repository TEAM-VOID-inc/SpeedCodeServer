const express = require('express');
const {check} = require('express-validator');

const vedio = require('../controllers/vedio');
const validate = require('../middlewares/validator');

const router = express.Router();

router.get('/getvedio/:id', vedio.getvediobyid);

router.get('/', [
    check('userId').not().isEmpty().withMessage({success:false,message:'userId is required'}),
], validate, vedio.getallvedio);

router.post('/',  [
    check('title').not().isEmpty().withMessage({success:false,message:'title is required'}),
    check('description').not().isEmpty().withMessage({success:false,message:'description is required'}),
    check('link').not().isEmpty().withMessage({success:false,message:'link is required'}),
    check('userId').not().isEmpty().withMessage({success:false,message:'UserId is required'}),
    check('author').not().isEmpty().withMessage({success:false,message:'author is required'}),
    check('type').not().isEmpty().withMessage({success:false,message:'type is required'})
], validate, vedio.addVedio);

// router.post('/', vedio.postallvedios);

router.get('/:id', vedio.getuservedio);

router.put('/:id',[
    check('userId').not().isEmpty().withMessage({success:false,message:'userId is required'}),
], validate, vedio.updatevedio);


router.delete('/:id',[
    check('userId').not().isEmpty().withMessage({success:false,message:'userId is required'}),
], validate, vedio.deletevedio);





module.exports = router;