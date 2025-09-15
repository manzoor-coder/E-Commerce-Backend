import Product from "../models/products.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createProduct = asyncHandler(async (req, res) => {
    console.log("req body", req.body);
    const { name, price, description, category, brand, stock, rating } = req.body;

    const images = req.files?.images || [];
    console.log("images", images);

    if (!name || !price || !description || !category || !brand || !stock || !rating) {
        throw new ApiError(400, "All fields are required");
    }

    const imagesPath = images.map(image => image.path);
    console.log("imagesPath", imagesPath);

    let imagesUrl = [];
    if (images && Array.isArray(images) && images.length > 0) {
        for (const image of imagesPath) {
            const imageUrl = await uploadOnCloudinary(image);
            imagesUrl.push(imageUrl.url);
        }
    }
     
    if(!imagesUrl.length) {
        throw new ApiError(400, "Images are required");
    }

    const product = await Product.create({
        name,
        price,
        description,
        images: imagesUrl,
        category,
        brand,
        stock,
        rating,
        createdBy: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find();
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

    // get product by id
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

   // update product
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    const { name, price, description, images, category, brand, stock, rating } = req.body;
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.category = category;
    product.brand = brand;
    product.stock = stock;
    product.rating = rating;
    await product.save();
    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

    // delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    await product.deleteOne();
    return res.status(200).json(new ApiResponse(200, "Product deleted successfully"));
});

export { createProduct, getAllProducts, updateProduct, getProductById, deleteProduct };