import app from "./index.js";
import connectDB from "./config/db.js";
import fs from "fs"; // Updated to use ES module import for fs

const PORT = 3000;

import Address from "./models/address.model.js";
import Cart from "./models/cart.model.js";
import CartItem from "./models/cartItems.model.js";
import Category from "./models/category.model.js";
import Order from "./models/order.model.js";
import OrderItems from "./models/orderItems.model.js";
import Product from "./models/product.model.js";
import PARequest from "./models/productApprovalRequest.model.js";
import Review from "./models/review.model.js";
import User from "./models/user.model.js";
import Wishlist from "./models/wishlist.model.js";
import WishlistItem from "./models/wishlistItem.model.js";

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
    // fetchAllData();
});

const fetchAllData = async () => {
    try {
        // Ensure the 'data' directory exists
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data', { recursive: true });
        }

        const users = await User.find({});
        const products = await Product.find({});
        const carts = await Cart.find({});
        const cartItems = await CartItem.find({});
        const categories = await Category.find({});
        const orders = await Order.find({});
        const orderItems = await OrderItems.find({});
        const addresses = await Address.find({});
        const productApprovalRequests = await PARequest.find({});
        const reviews = await Review.find({});
        const wishlists = await Wishlist.find({});
        const wishlistItems = await WishlistItem.find({});

        // Writing data to JSON files
        fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
        fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
        fs.writeFileSync('data/carts.json', JSON.stringify(carts, null, 2));
        fs.writeFileSync('data/cartItems.json', JSON.stringify(cartItems, null, 2));
        fs.writeFileSync('data/categories.json', JSON.stringify(categories, null, 2));
        fs.writeFileSync('data/orders.json', JSON.stringify(orders, null, 2));
        fs.writeFileSync('data/orderItems.json', JSON.stringify(orderItems, null, 2));
        fs.writeFileSync('data/addresses.json', JSON.stringify(addresses, null, 2));
        fs.writeFileSync('data/productApprovalRequests.json', JSON.stringify(productApprovalRequests, null, 2));
        fs.writeFileSync('data/reviews.json', JSON.stringify(reviews, null, 2));
        fs.writeFileSync('data/wishlists.json', JSON.stringify(wishlists, null, 2));
        fs.writeFileSync('data/wishlistItems.json', JSON.stringify(wishlistItems, null, 2));

        console.log("Data fetched and written to JSON files successfully!");
    } catch (error) {
        console.error("Error fetching data", error.message);
    }
};