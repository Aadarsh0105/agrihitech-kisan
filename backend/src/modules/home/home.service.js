const mongoose = require("mongoose");
const Banner = require("../banner/banner.model");
const Category = require("../category/category.model");
const Brand = require("../brand/brand.model");
const User = require("../auth/auth.model");


const getPopularCompanyBrands = async () => User.aggregate([
  { $match: { role: "COMPANY" } },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "companyBrand",
      as: "companyProducts"
    }
  },
  { $addFields: { totalProducts: { $size: "$companyProducts" } } },
  { $match: { totalProducts: { $gt: 0 } } },
  { $sort: { totalProducts: -1, createdAt: -1 } },
  { $limit: 4 },
  {
    $project: {
      _id: 1,
      name: "$companyName",
      image: "$profileimage",
      totalProducts: 1,
      createdAt: 1,
      isCompany: { $literal: true }
    }
  }
]);

const withPopularCompanies = async brands => {
  const companies = await getPopularCompanyBrands();
  return [...brands, ...companies]
    .sort((left, right) => (right.totalProducts || 0) - (left.totalProducts || 0) ||
      new Date(right.createdAt || 0) - new Date(left.createdAt || 0))
    .slice(0, 4);
};

exports.getHomeData = async (userId) => {

  // 🔹 banners (max 5)
  const banners = await Banner.find()
    .sort({ createdAt: -1 })
    .limit(5);

  // 🔥 categories with brand usage (max 4)
  const categories = await Category.aggregate([
    { $sort: { createdAt: 1 } },
    { $limit: 4 },

    {
      $lookup: {
        from: "brands", // 🔥 collection name
        localField: "_id",
        foreignField: "category",
        as: "brands"
      }
    },

    {
      $lookup: {
        from: "users",
        let: { categoryName: "$name" },
        pipeline: [
          {
            $match: {
              role: "COMPANY",
              $expr: {
                $in: [
                  { $toLower: "$$categoryName" },
                  {
                    $map: {
                      input: { $ifNull: ["$categories", []] },
                      as: "companyCategory",
                      in: { $toLower: "$$companyCategory" }
                    }
                  }
                ]
              }
            }
          }
        ],
        as: "companyBrands"
      }
    },

    {
      $addFields: {
        brandIds: {
          $map: {
            input: "$brands",
            as: "b",
            in: "$$b._id"
          }
        },
        totalBrands: {
          $add: [{ $size: "$brands" }, { $size: "$companyBrands" }]
        }
      }
    },

    {
      $project: {
        brands: 0, // optional (hide full brand data)
        companyBrands: 0
      }
    }
  ]);

  // 🔹 top brands (max 4)
  // 🔹 top brands (max 4) - only B2B products count
  const brands = await Brand.aggregate([
  { $sort: { createdAt: -1 } },
  { $limit: 4 },

  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "brand",
      as: "products"
    }
  },

  {
    $unwind: {
      path: "$products",
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $lookup: {
      from: "users",
      localField: "products.createdBy",
      foreignField: "_id",
      as: "creator"
    }
  },

  {
    $unwind: {
      path: "$creator",
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      image: { $first: "$image" },
      createdAt: { $first: "$createdAt" },

      totalProducts: {
        $sum: {
          $cond: [
            { $eq: ["$creator.role", "B2B"] },
            1,
            0
          ]
        }
      }
    }
  },

  { $sort: { createdAt: -1 } }
]);


  return {
    banners,
    categories,
    brands: await withPopularCompanies(brands)
  };
};


exports.getUserHomeData = async () => {
  // 🔹 banners
  const banners = await Banner.find()
    .sort({ createdAt: -1 })
    .limit(5);

  // 🔹 categories with ADMIN brands only
  // 🔹 categories with ADMIN products count
  const categories = await Category.aggregate([
    { $sort: { createdAt: 1 } },
    { $limit: 4 },

    {
      $lookup: {
        from: "products",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$category", "$$categoryId"]
              }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "productCreator"
            }
          },
          { $unwind: "$productCreator" },

          {
            $match: {
              "productCreator.role": "ADMIN"
            }
          }
        ],
        as: "adminProducts"
      }
    },

    {
      $addFields: {
        totalProducts: { $size: "$adminProducts" }
      }
    },

    {
      $project: {
        adminProducts: 0
      }
    }
  ]);

  // 🔹 top brands with ADMIN products only
  const brands = await Brand.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "creator"
      }
    },

    { $unwind: "$creator" },

    {
      $match: {
        "creator.role": "ADMIN"
      }
    },

    {
      $lookup: {
        from: "products",
        let: { brandId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$brandId", "$brand"]
              }
            }
          },

          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "productCreator"
            }
          },

          { $unwind: "$productCreator" },

          {
            $match: {
              "productCreator.role": "ADMIN"
            }
          }
        ],
        as: "adminProducts"
      }
    },

    {
      $addFields: {
        totalProducts: { $size: "$adminProducts" }
      }
    },

    // 🔥 Highest product count first
    {
      $sort: {
        totalProducts: -1,
        createdAt: -1
      }
    },

    // 🔥 Top 4 only
    { $limit: 4 },

    {
      $project: {
        adminProducts: 0,
        creator: 0
      }
    }
  ]);

  return {
    banners,
    categories,
    brands: await withPopularCompanies(brands)
  };
};
