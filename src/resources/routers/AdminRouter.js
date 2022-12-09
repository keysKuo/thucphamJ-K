const express = require('express')
const router = express.Router()
router.get('/', (req, res) => {
    res.render('Pages/Admin/adminHome', { layout: 'admin' })
})

router.get('/add-product', (req, res) => {
    const success = req.flash('success') || '';
    const error = req.flash('error') || '';
    res.render('Pages/Admin/addProduct', { layout: 'admin', success, error })
})

router.get('/list-product', (req, res) => {
    const success = req.flash('success') || '';
    const error = req.flash('error') || '';
    res.render('Pages/Admin/listProduct', { layout: 'admin', success, error })
})
module.exports = router