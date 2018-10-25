const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'non-admin'
    })
})


module.exports = router;