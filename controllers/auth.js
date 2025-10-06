const { response } = require("express");
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require("../helpers/jwt");


const createUser = async (req, res = response)=>{
    const {email,password} = req.body;

    try {
        const existEmail = await User.findOne({email:email});

        if (existEmail) {
            return res.status(400).json({
                ok:false,
                msg:'Email is already registered'
            });
        }
        const user = new User(req.body);

        //encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Generate JWT
        const token = await generateJWT(user.id, user.role);

        res.json({
            ok:true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Talk to the admin'
        })
    }
    
}

const signin = async (req, res = response)=>{
    const {email,password} = req.body;

    try {
        const userDB = await User.findOne({email:email});

        if (!userDB) {
            return res.status(404).json({
                ok:false,
                msg:'Email not found'
            });
        }

        //validate password
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg:'Password is not valid'
            });
        }

        //Generate JWT
        const token = await generateJWT(userDB.id, userDB.role);

        
        res.json({
            ok:true,
            user:userDB,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Talk to the admin'
        })
    }
    
}

const renewToken = async(req, res =response)=>{
    const uid = req.uid;

    try {
        //get user from DB,
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                ok:false,
                msg: 'User not found'
            });
        }

        //generate new JWT
        const token = await generateJWT(uid, user.role);

        res.json({
        ok:true,
        user,
        token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Talk to the admin'
        });
    };
}

module.exports = {
    createUser,
    signin,
    renewToken
}