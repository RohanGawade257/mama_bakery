import Product from "../models/Product.js";

const sanitizeString = (value) => (typeof value === "string" ? value.trim() : "");
const toPositiveNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
};

export const listProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      featured,
      page = 1,
      limit = 12,
      sort = "createdAt"
    } = req.query;

    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    const safeLimit = Math.min(Number(limit) || 12, 60);
    const skip = (Math.max(Number(page), 1) - 1) * safeLimit;
    const sortOption = sort === "price" ? { price: 1 } : { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(safeLimit),
      Product.countDocuments(query)
    ]);

    res.json({
      data: products,
      meta: {
        total,
        page: Number(page),
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listCategories = async (_req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ data: categories.sort() });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found.");
    }
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, image, featured } = req.body;
    const normalizedName = sanitizeString(name);
    const normalizedDescription = sanitizeString(description);
    const normalizedCategory = sanitizeString(category);
    const normalizedImage = sanitizeString(image);
    const numericPrice = toPositiveNumber(price);
    const numericStock = stock === undefined ? 0 : toPositiveNumber(stock);

    if (
      !normalizedName ||
      !normalizedDescription ||
      !normalizedCategory ||
      !normalizedImage ||
      Number.isNaN(numericPrice)
    ) {
      const error = new Error("Name, description, category, price, and image are required.");
      error.statusCode = 400;
      throw error;
    }

    if (numericPrice < 0 || Number.isNaN(numericStock) || numericStock < 0) {
      const error = new Error("Price and stock must be valid non-negative numbers.");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.create({
      name: normalizedName,
      description: normalizedDescription,
      category: normalizedCategory,
      price: numericPrice,
      stock: numericStock,
      image: normalizedImage,
      featured: String(featured) === "true" || featured === true
    });

    res.status(201).json({ data: product, message: "Product created successfully." });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    const { name, description, category, price, stock, image, featured } = req.body;

    if (name !== undefined) {
      const normalizedName = sanitizeString(name);
      if (!normalizedName) {
        const error = new Error("Product name cannot be empty.");
        error.statusCode = 400;
        throw error;
      }
      product.name = normalizedName;
    }

    if (description !== undefined) {
      const normalizedDescription = sanitizeString(description);
      if (!normalizedDescription) {
        const error = new Error("Product description cannot be empty.");
        error.statusCode = 400;
        throw error;
      }
      product.description = normalizedDescription;
    }

    if (category !== undefined) {
      const normalizedCategory = sanitizeString(category);
      if (!normalizedCategory) {
        const error = new Error("Product category cannot be empty.");
        error.statusCode = 400;
        throw error;
      }
      product.category = normalizedCategory;
    }

    if (price !== undefined) {
      const numericPrice = toPositiveNumber(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        const error = new Error("Price must be a valid non-negative number.");
        error.statusCode = 400;
        throw error;
      }
      product.price = numericPrice;
    }

    if (stock !== undefined) {
      const numericStock = toPositiveNumber(stock);
      if (Number.isNaN(numericStock) || numericStock < 0) {
        const error = new Error("Stock must be a valid non-negative number.");
        error.statusCode = 400;
        throw error;
      }
      product.stock = numericStock;
    }

    if (image !== undefined) {
      const normalizedImage = sanitizeString(image);
      if (!normalizedImage) {
        const error = new Error("Image URL cannot be empty.");
        error.statusCode = 400;
        throw error;
      }
      product.image = normalizedImage;
    }

    if (featured !== undefined) {
      product.featured = String(featured) === "true" || featured === true;
    }

    const updated = await product.save();
    res.json({ data: updated, message: "Product updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};
