const Scheme = require("./scheme.model");
const sanitize = require("../../utils/sanitizeRichText");

const createError = (message, statusCode) => Object.assign(new Error(message), { statusCode });
const slugify = (value) => String(value || "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const getPayload = (body) => ({
  title: body.title?.trim(),
  tags: String(body.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
  content: sanitize(body.content),
  benefits: sanitize(body.benefits),
  eligibility: sanitize(body.eligibility),
  applicationProcess: sanitize(body.applicationProcess),
  requiredDocuments: sanitize(body.requiredDocuments)
});

const getUniqueSlug = async (value, excludeId) => {
  const base = slugify(value) || `scheme-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (await Scheme.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

exports.getAllSchemes = async (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const filter = {};

  if (query.search) {
    filter.$or = ["title", "tags"].map((key) => ({
      [key]: { $regex: query.search, $options: "i" }
    }));
  }
  const [schemes, total] = await Promise.all([
    Scheme.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
    Scheme.countDocuments(filter)
  ]);

  return { schemes, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } };
};

exports.getSchemeById = async (id) => {
  const scheme = await Scheme.findById(id);
  if (!scheme) throw createError("Scheme not found", 404);
  return scheme;
};

exports.getSchemeBySlug = async (slug) => {
  const scheme = await Scheme.findOne({ slug: slugify(slug) });
  if (!scheme) throw createError("Scheme not found", 404);
  return scheme;
};

exports.createScheme = async (body, userId) => {
  const payload = getPayload(body);
  const slug = await getUniqueSlug(body.slug || payload.title);
  return Scheme.create({ ...payload, slug, createdBy: userId });
};

exports.updateScheme = async (id, body) => {
  const scheme = await exports.getSchemeById(id);
  const payload = getPayload(body);
  const requestedSlug = body.slug || (payload.title !== scheme.title ? payload.title : scheme.slug);
  Object.assign(scheme, payload, { slug: await getUniqueSlug(requestedSlug, scheme._id) });

  await scheme.save();
  return scheme;
};

exports.deleteScheme = async (id) => {
  const scheme = await exports.getSchemeById(id);
  await scheme.deleteOne();
};
