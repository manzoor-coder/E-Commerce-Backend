import Cart from "../models/cart.models.js";
import Product from "../models/products.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, products: [], totalPrice: 0, });
    }
    const existingProduct = cart.products.find(item => item.product.toString() === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }

    //  Recalculate total price
    cart.totalPrice = 0;
    for (let item of cart.products) {
        const prod = await Product.findById(item.product);
        cart.totalPrice += prod.price * item.quantity;
    }


    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "Product added to cart successfully"));
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));

});

const updateCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    const existingProduct = cart.products.find(item => item.product.toString() === productId);
    if (existingProduct) {
        existingProduct.quantity = quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }
    // Recalculate total price
    cart.totalPrice = 0;
    for (let item of cart.products) {
        const prod = await Product.findById(item.product);
        cart.totalPrice += prod.price * item.quantity;
    }
    await cart.save();
    return res.status(200).json(new ApiResponse(200, cart, "Cart updated successfully"));

});

const removeFromCart = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    // console.log("id", id);
  
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }
  
    // Remove product
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== id
    );
  
    // Recalculate total price
    cart.totalPrice = 0;
    for (let item of cart.products) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }
  
    await cart.save(); // 👈 save changes
  
    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Product removed from cart successfully"));
  });
  

export { addToCart, getCart, updateCart, removeFromCart }; 
