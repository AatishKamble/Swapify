
import Categories from '../models/category.model.js';

import Product from '../models/product.model.js';
import Address from '../models/address.model.js';


const createProduct = async (reqData) => {

    let topLevelCategory = await Categories.findOne({ name: reqData.topLevelCategory });

    if (!topLevelCategory) {
        topLevelCategory = new Categories({
            name: reqData.topLevelCategory,
            level: 1
        });
        await topLevelCategory.save();
    }

    let secondLevel = await Categories.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevelCategory._id,

    });
    if (!secondLevel) {
        secondLevel = new Categories({
            name: reqData.secondLevelCategory,
            parentCategory: topLevelCategory._id,
            level: 2
        });
        await secondLevel.save();
    }



//     let address = await Address.findOne({
//          houseNo:reqData.houseNo,
//         streetAddress:reqData.streetAddress,
//         city:reqData.city,
//         state:reqData.state,
//         zipCode:reqData.zipCode,
//         user:user._id
// });

//     if (!address) {
//         address = new Address({
//             city: reqData.city,
//             state: reqData.state
//         });
//         await address.save();
//     }


    const product = new Product(
        {

            title: reqData.title,
            description: reqData.description,
            price: reqData.price,
            category: secondLevel._id,
            imageURL: reqData.imageUrl,
            // address: address._id,

        }
    );


    return await product.save();
}

async function addApprovedProduct(product){

    const approvedProduct = new Product(
        {
            title: product.productName,
            description: product.productDescription,
            price: product.expectedPrice,
            category: product.category._id,
            imageURL: product.images[0].imageUrl,
            state: 'Unsold'
        }
    );
    
    return await approvedProduct.save();
}


async function deleteProduct(productId) {
    const product = findProductById(productId);

    await Product.findByIdAndDelete(productId);
    return "Product deleted Successfully";
}


async function updateProduct(productId, reqData) {
   const productUpdated= await Product.findByIdAndUpdate(productId, reqData,{new:true});

    return productUpdated;

}



async function findProductById(productId) {
    const product = await Product.findById(productId).populate("category").exec();
    
    // .populate("address");

    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
    return product;

}

async function getAllProducts(reqQuery) {
    let { category, minPrice, maxPrice, sort, pageNumber, pageSize } = reqQuery;

    // Parse numeric parameters
    pageSize = parseInt(pageSize) || 10;
    pageNumber = parseInt(pageNumber) || 1;
    minPrice = minPrice ? parseInt(minPrice) : 0;
    maxPrice = maxPrice ? parseInt(maxPrice) : 1000000;

    // Base query to find only unsold products
    let baseQuery = {
        $or: [
            { state: "Unsold" },
            { state: { $exists: false } },
            { state: null },
            { state: "" },
            { state: "Request_Approved" }
        ]
    };

    // Handle category search
    if (category) {
        // Clean up category input - combine all category-related keys from reqQuery
        let categorySearch = category;
        
        // Check if there are other keys that might be part of the category name
        Object.keys(reqQuery).forEach(key => {
            if (key !== 'category' && key !== 'minPrice' && key !== 'maxPrice' && 
                key !== 'sort' && key !== 'pageNumber' && key !== 'pageSize') {
                // This might be part of a category name that was split due to spaces
                categorySearch += ' ' + key.trim();
            }
        });
        
        // Remove any trailing commas and trim
        categorySearch = categorySearch.replace(/,\s*$/, '').trim();
        
        // Split by commas if multiple categories are provided
        const categoryTerms = categorySearch.split(',').map(term => term.trim()).filter(Boolean);
        
        if (categoryTerms.length > 0) {
            // Find all matching categories (direct matches)
            const directMatches = await Categories.find({
                name: { $regex: new RegExp(categoryTerms.join('|'), 'i') }
            });
            
            // Find all parent categories that match
            const parentMatches = await Categories.find({
                name: { $regex: new RegExp(categoryTerms.join('|'), 'i') }
            });
            
            // Get all child categories of the matching parent categories
            const childCategories = [];
            for (const parent of parentMatches) {
                const children = await Categories.find({ parentCategory: parent._id });
                childCategories.push(...children);
            }
            
            // Combine all category IDs (direct matches and children of matching parents)
            const allCategoryIds = [
                ...directMatches.map(cat => cat._id),
                ...childCategories.map(cat => cat._id)
            ];
            
            if (allCategoryIds.length > 0) {
                baseQuery.category = { $in: allCategoryIds };
            }
        }
    }

    // Add price filter
    if (minPrice || maxPrice) {
        baseQuery.price = {};
        if (minPrice) baseQuery.price.$gte = minPrice;
        if (maxPrice) baseQuery.price.$lte = maxPrice;
    }

    // Create the query
    let query = Product.find(baseQuery).populate("category");

    // Apply sorting
    if (sort) {
        if (sort === "asc-price") {
            query = query.sort({ price: 1 });
        } else if (sort === "Date-Created") {
            query = query.sort({ createdAt: -1 });
        } else {
            query = query.sort({ price: -1 });
        }
    } else {
        // Default sorting
        query = query.sort({ createdAt: -1 });
    }

    // Count total products for pagination
    const totalProduct = await Product.countDocuments(baseQuery);

    // Apply pagination
    if (pageNumber !== 0 && pageSize !== 0) {
        const skip = (pageNumber - 1) * pageSize;
        query = query.skip(skip).limit(pageSize);
    }

    // Execute the query
    const products = await query.exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalProduct / pageSize);

    return { 
        content: products, 
        currentPage: pageNumber, 
        totalPages,
        totalItems: totalProduct
    };
}

async function createMultipleProducts(products) {

    for (const product of products) {

        await createProduct(product);
    }

}







export default {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts,
    addApprovedProduct,
}