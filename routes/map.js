const router = require('express').Router();
const mapController = require('../controllers/mapController');
const {authenticateUser} = require('../middleware/authenticateUser');

router.post('/findIntersection',authenticateUser,mapController.findIntersection);


module.exports = router;