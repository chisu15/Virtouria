const swaggerJSDoc = require("swagger-jsdoc");
const mongooseToSwagger = require("mongoose-to-swagger");

// Import các mô hình Mongoose của bạn
const Category = require("../models/category.model");
const Culture = require("../models/culture.model");
const Mediafile = require("../models/mediafile.model");
const Review = require("../models/review.model");
const Tour = require("../models/tour.model");
const User = require("../models/user.model");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Virtouria API Documentation",
        version: "1.0.0",
        description: "This is the API documentation for our project.",
    },
    servers: [
        {
            url: "http://localhost:8080",
            description: "Local development server",
        },
        {
            url: "http://14.225.36.109:8080",
        },
	{
	    url: "http://45.124.94.12:8001",
	},

    ],
    components: {
        schemas: {
            // Sử dụng mongoose-to-swagger để tạo schema tự động từ mô hình Mongoose
            Category: mongooseToSwagger(Category),
            Culture: mongooseToSwagger(Culture),
            Mediafile: mongooseToSwagger(Mediafile),
            Review: mongooseToSwagger(Review),
            Tour: mongooseToSwagger(Tour),
            User: mongooseToSwagger(User),
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
