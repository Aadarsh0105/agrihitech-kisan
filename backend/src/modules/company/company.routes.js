const router = require('express').Router();
const controller = require('./company.controller');
const { verifyToken, isCompany } = require('../../middleware/isAdmin');
router.use(verifyToken, isCompany);
router.get('/dealers', controller.getDealers);
router.post('/dealers', controller.assignDealer);
router.patch('/dealers/:id/status', controller.setDealerStatus);
router.delete('/dealers/:id', controller.removeDealer);
module.exports = router;
