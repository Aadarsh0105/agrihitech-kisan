const service = require("./adminAccount.service");

exports.list = async (req, res) => {
  try {
    const result = await service.getAccounts(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await service.getAccountById(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
