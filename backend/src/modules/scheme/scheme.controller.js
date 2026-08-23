const schemeService = require("./scheme.service");

exports.list = async (req, res) => {
  try {
    const result = await schemeService.getAllSchemes(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const scheme = await schemeService.getSchemeById(req.params.id);
    res.json({ scheme });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const scheme = await schemeService.getSchemeBySlug(req.params.slug);
    res.json({ scheme });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const scheme = await schemeService.createScheme(req.body, req.user._id);
    res.status(201).json({ message: "Scheme created successfully", scheme });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const scheme = await schemeService.updateScheme(req.params.id, req.body);
    res.json({ message: "Scheme updated successfully", scheme });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await schemeService.deleteScheme(req.params.id);
    res.json({ message: "Scheme deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
