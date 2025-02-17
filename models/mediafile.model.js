const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MediaFileSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
		},
		path: {
			type: String,
		},
	},
	{
		timestamps: true,
		collection: "MediaFile",
	}
);

const MediaFile = mongoose.model("MediaFile", MediaFileSchema);

module.exports = MediaFile;
