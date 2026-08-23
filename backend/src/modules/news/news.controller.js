const newsService = require("./news.service");

exports.list = async (req, res) => {
  try {
    const result = await newsService.getAllNews(req.query);
    res.json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const news = await newsService.getNewsById(req.params.id);
    res.json({ news });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const news = await newsService.getNewsBySlug(req.params.slug);
    res.json({ news });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const news = await newsService.createNews(req.body, req.file, req.user._id);
    res.status(201).json({ message: "News article created successfully", news });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const news = await newsService.updateNews(req.params.id, req.body, req.file);
    res.json({ message: "News article updated successfully", news });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await newsService.deleteNews(req.params.id);
    res.json({ message: "News article deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
