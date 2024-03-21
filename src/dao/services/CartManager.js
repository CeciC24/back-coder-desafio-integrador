import CartsModel from "../models/cartsModel.js";
import ProductManager from "./ProductManager.js";

class CartManager {
    constructor() {
        console.log('CartManager constructor')
    }

    async addCart(newCart = { products: [] }) {
        let response = await CartsModel.create(newCart)
        return response
    }

    async getCarts() {
        let response = await CartsModel.find()
        return response
    }

    async getCartById(id) {
        let response = await CartsModel.findById(id)
        return response
    }

    async addProductToCart(cid, pid) {
        let cart = await this.getCartById(cid)
        let product = await ProductManager.getProductById(pid)
        
        if (cart && product) {
            let prodID = product._id

            if (prodID) {
                CartsModel.updateOne(
                    { _id: cid, "products._id": prodID },
                    { $inc: { "products.$.quantity": 1 } }
                )
            } else {
                CartsModel.updateOne(
                    { _id: cid },
                    { $push: { products: { _id: pid, quantity: 1 } } }
                )
            }
        }
    }

    async deleteProductFromCart(cid, pid) {
        let cart = await this.getCartById(cid)
        let product = await ProductManager.getProductById(pid)
        
        if (cart && product) {
            let prodID = product._id

            if (prodID) {
                if(product.quantity > 1) {
                    CartsModel.updateOne(
                        { _id: cid, "products._id": prodID },
                        { $inc: { "products.$.quantity": -1 } }
                    )
                } else {
                    CartsModel.updateOne(
                        { _id: cid },
                        { $pull: { products: { _id: pid } } }
                    )
                }
            } else {
                throw new Error(`⚠️  Product ID: ${pid} Not found`)
            }
        }
    }

    async deleteCart(id) {
        let response = await CartsModel.findByIdAndDelete(id)
        return response
    }
}


export default CartManager