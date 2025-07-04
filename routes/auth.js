/*
    path: api/signin 
*/

const {Router } = require('express');
const { check } = require('express-validator');

const { createUser, signin, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/new', [
    check('name','Name is mandatory').not().isEmpty(),
    check('email','Must be an email format').isEmail(),
    check('email','email is mandatory').not().isEmpty(),
    check('password','Password must be at least 6 characters long').isLength({min:6}),
    check('password','password is mandatory').not().isEmpty(),
    validateFields
    
] ,createUser);

router.post('/', [
    check('email','Must be an email format').isEmail(),
    check('email','email is mandatory').not().isEmpty(),
    check('password','Password must be at least 6 characters long').isLength({min:6}),
    check('password','password is mandatory').not().isEmpty(),
    validateFields
    
] ,signin);

router.get('/renew',validateJWT,renewToken);

module.exports = router;