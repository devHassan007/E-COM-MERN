const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const mongoose = require("mongoose");
const ApiFeatures = require("../utils/apifeatures");


//Create A Product ---Admin Pannel
exports.createProducts = catchAsyncError(async (req, res, next) => {
    // Set the user field in req.body to the authenticated user's ID
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    });
});

//Getting the Products --

exports.getAllProducts = catchAsyncError(async (req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();//will use for the Frontend

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    })
});

//Getting A Product
exports.gettingProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});



//Updating the Product
exports.updateProducts = catchAsyncError(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        product
    });

});

//Deleting the Product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});

// Create New Review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.comment = comment;
                rev.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.ratings =
        product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
        product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});


//Get Product Reviews
exports.getProductReviews = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        review: product.reviews,
    });
});


//Delete Product Review
exports.deleteReview = async (req, res, next) => {
    try {
        const { productId, id } = req.query;

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler("Invalid ID provided", 400));
        }

        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Check if reviews exist
        if (!product.reviews || !Array.isArray(product.reviews)) {
            return next(new ErrorHandler("No reviews found for this product", 404));
        }

        // Process the review deletion
        const reviews = product.reviews.filter((rev) => rev._id.toString() !== id);

        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / (reviews.length || 1);
        const numOfReviews = reviews.length;

        // Update the product
        await Product.findByIdAndUpdate(
            productId,
            { reviews, ratings: avgRating, numOfReviews },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Error occurred:", error);
        next(new ErrorHandler("Internal Server Error", 500));
    }
};
