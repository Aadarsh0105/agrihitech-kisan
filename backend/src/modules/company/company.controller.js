const service = require('./company.service');
exports.getDealers = async (req, res) => { try { res.json({ dealers: await service.getDealers(req.user._id) }); } catch (error) { res.status(400).json({ message: error.message }); } };
exports.assignDealer = async (req, res) => { try { res.status(201).json({ dealer: await service.assignDealer(req.user._id, req.body.mobile) }); } catch (error) { res.status(400).json({ message: error.message }); } };
exports.setDealerStatus = async (req, res) => { try { res.json({ dealer: await service.setDealerStatus(req.user._id, req.params.id, req.body.status) }); } catch (error) { res.status(400).json({ message: error.message }); } };
exports.removeDealer = async (req, res) => { try { await service.removeDealer(req.user._id, req.params.id); res.json({ message: 'Dealer removed successfully' }); } catch (error) { res.status(400).json({ message: error.message }); } };
