/*
    path: api/users 
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getUserById, updateUser, changePassword, deleteUser} = require("../controllers/users");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

//Get user by Id
router.get("/:id", validateJWT, getUserById);

//UPDATE user
router.put(
    "/:id",
    [
        validateJWT,
        // check("name","Name is mandatory").optional().not().isEmpty(),
        // check("email","Must be a valid email").optional().isEmail(),
        // validateFields,
    ],
    updateUser
);

//CHANGE password
router.patch(
    "/:id/password",
    [
        validateJWT,
        check("newPassword", "Password must be at least 6 characters long").isLength({min:6}),
        validateFields,
    ],
    changePassword  
);

//DELETE account
router.delete("/:id",validateJWT, deleteUser);

module.exports = router;