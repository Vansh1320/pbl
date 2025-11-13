const express = require('express')
const { registerUser } = require ("../../constrollers/auth/auth-controllers")

const router = express.Router();

router.post('/register', registerUser);

module.export = router;