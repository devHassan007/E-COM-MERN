const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter the Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter the description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter the Price"],
        maxLength: [6, "Price should not exceed 6 characters"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter the Category"],
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter the Stock"],
        maxLength: [4, "Stock should not exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Products", productSchema);
