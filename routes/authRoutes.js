const express = require("express")
const authContoller = require("../controllers/authController")
const router = express.Router()

router.post("/register", authContoller.register)
router.post("/login", authContoller.login)
router.delete("/logout", authContoller.logout)

module.exports = router
