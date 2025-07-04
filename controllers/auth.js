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

        //Generate JWT
        const token = await generateJWT(user.id);

        //encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        
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
        const token = await generateJWT(userDB.id);

        
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

    //generate new JWT
    const token = await generateJWT(uid);

    //get user by ID,
    const user = await User.findById(uid);

    res.json({
        ok:true,
        user,
        token
    });
    
}

module.exports = {
    createUser,
    signin,
    renewToken
}