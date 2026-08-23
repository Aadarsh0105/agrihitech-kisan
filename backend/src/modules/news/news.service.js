const News = require("./news.model");
const cloudinary = require("../../config/cloudinary");
const sanitize = require("../../utils/sanitizeRichText");

const createError = (message, statusCode) => Object.assign(new Error(message), { statusCode });
const slugify = (value) => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const getPayload = (body) => ({
  title: body.title?.trim(),
  content: sanitize(body.content)
});

const getUniqueSlug = async (value, excludeId) => {
  const base = slugify(value) || `news-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (await News.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) slug = `${base}-${suffix++}`;
  return slug;
};

exports.getAllNews = async (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const filter = {};

  if (query.search) {
    filter.title = { $regex: query.search, $options: "i" };
  }

  const [news, total] = await Promise.all([
    News.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    News.countDocuments(filter)
  ]);

  return { news, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } };
};

exports.getNewsById = async (id) => {
  const news = await News.findById(id);
  if (!news) throw createError("News article not found", 404);
  return news;
};

exports.getNewsBySlug = async (slug) => {
  const news = await News.findOne({ slug: slugify(slug) });
  if (!news) throw createError("News article not found", 404);
  return news;
};

exports.createNews = async (body, file, userId) => {
  if (!file) throw createError("News image is required", 400);
  const payload = getPayload(body);
  const slug = await getUniqueSlug(body.slug || payload.title);
  return News.create({ ...payload, slug, image: file.path, public_id: file.filename, createdBy: userId });
};

exports.updateNews = async (id, body, file) => {
  const news = await exports.getNewsById(id);
  const payload = getPayload(body);
  const requestedSlug = body.slug || (payload.title !== news.title ? payload.title : news.slug);
  Object.assign(news, payload, { slug: await getUniqueSlug(requestedSlug, news._id) });

  if (file) {
    if (news.public_id) await cloudinary.uploader.destroy(news.public_id);
    news.image = file.path;
    news.public_id = file.filename;
  }

  await news.save();
  return news;
};

exports.deleteNews = async (id) => {
  const news = await exports.getNewsById(id);
  if (news.public_id) await cloudinary.uploader.destroy(news.public_id);
  await news.deleteOne();
};
