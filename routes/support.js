/*
    path: api/support
*/

const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate-jwt");
const { sendSupportMessage } = require("../controllers/support");

const router = Router();

router.post("/", validateJWT, sendSupportMessage);

module.exports = router;
