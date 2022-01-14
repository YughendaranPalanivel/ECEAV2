const router = require("express").Router();
const {signup, login, logout, generateAccessToken} = require("../Controllers/auth.js");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/token", generateAccessToken);

module.exports = router;