const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const e = require('express');

const getUserById = async (req, res = response) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                ok:false,
                msg: "User not found"
            });
        }

        //Only self or admin can access
        if (req.uid !== id && req.role !=="admin") {
            return res.status(403).json({
                ok:false,
                msg:"Unauthorized action",
            });
        }

        res.json({ok: true, user});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Talk to the admin"
        });
    }
};

const updateUser = async (req, res = response) => {
    console.log(">>> Hit updateUser endpoint");
    
    try {
        const { id } = req.params;
        const { password, ...fields} = req.body;

        //Only self or admin can access
        if (req.uid !== id && req.role !=="admin") {
            return res.status(403).json({
                ok:false,
                msg:"Unauthorized action",
            });
        }
        console.log("update payload: ", fields);
        
        const user = await User.findByIdAndUpdate(id, fields, { new:true});

        res.json({ok:true, user});

    } catch (error) {
        console.log("UpdateUser error:", error);
        console.log(error);
        res.status(500).json({ok:false, msg:"Talk to the admin"});
    }
};

const changePassword = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        //Only self or admin can access
        if (req.uid !== id && req.role !=="admin") {
            return res.status(403).json({
                ok:false,
                msg:"Unauthorized action",
            });
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        const user = await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true}
        );

        res.json({ok:true, msg:"Password updated"});

    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false, msg: "Talk to the admin"});
    }
};

const deleteUser = async (req, res = response) => {
    try {
        const { id } = req.params;

        //Only self or admin can access
        if (req.uid !== id && req.role !=="admin") {
            return res.status(403).json({
                ok:false,
                msg:"Unauthorized action",
            });
        }
        
        await User.findByIdAndDelete(id);
        res.json({ok:true, msg: "User deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok:false, msg: "Talk to the admin"});
    }
};

module.exports = {
    getUserById,
    updateUser,
    changePassword,
    deleteUser,
};