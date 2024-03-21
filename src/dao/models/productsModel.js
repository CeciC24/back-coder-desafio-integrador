import mongoose from 'mongoose'
const { Schema } = mongoose

const collection = 'products'

const productSchema = new Schema({
	status: { type: Boolean, default: true },
	title: { type: String, require: true },
	description: { type: String, require: true },
	code: { type: String, require: true, unique: true },
	price: { type: Number, require: true },
	stock: { type: Number, require: true },
	category: { type: String, require: true },
	thumbnails: { type: [String] },
})

const ProductsModel = mongoose.model(collection, productSchema)

export default ProductsModel
