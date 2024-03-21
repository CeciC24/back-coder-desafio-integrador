import mongoose from 'mongoose'
const { Schema } = mongoose

const collection = 'carts'

const cartSchema = new Schema({
	products: { type: [{ id: String, quantity: Number }], default: [] },
})

const CartsModel = mongoose.model(collection, cartSchema)

export default CartsModel
