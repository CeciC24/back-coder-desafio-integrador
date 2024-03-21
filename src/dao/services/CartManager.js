import CartsModel from "../models/cartsModel.js";
import ProductManager from "./ProductManager.js";

const ProductMngr = new ProductManager()

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
        let product = await ProductMngr.getProductById(pid)
        
        if (cart) {
            if(product) {
                if (cart.products.find(p => p._id == pid)) {
                    await CartsModel.updateOne(
                        { _id: cid, "products._id": pid },
                        { $inc: { "products.$.quantity": 1 } }
                    )
                } else {
                    await CartsModel.updateOne(
                        { _id: cid },
                        { $push: { products: { _id: pid, quantity: 1 } } }
                    )
                }
            } else {
                throw new Error(`⚠️  Product ID: ${pid} Not found`)
            }
        } else {
            throw new Error(`⚠️  Cart ID: ${cid} Not found`)
        }

        let updatedCart = await this.getCartById(cid)
        return updatedCart
    }

    async deleteProductFromCart(cid, pid) {
        let cart = await this.getCartById(cid)
        
        if (cart) {
            const prodInCart = cart.products.find(p => p._id == pid)
            console.log("prodInCart", prodInCart)
            if (prodInCart) {
                if(prodInCart.quantity > 1) {
                    await CartsModel.updateOne(
                        { _id: cid, "products._id": pid },
                        { $inc: { "products.$.quantity": -1 } }
                    )
                } else {
                    await CartsModel.updateOne(
                        { _id: cid },
                        { $pull: { products: { _id: pid } } }
                    )
                }
            } else {
                throw new Error(`⚠️  Product ID: ${pid} Not found`)
            }
        } else {
            throw new Error(`⚠️  Cart ID: ${cid} Not found`)
        }

        let updatedCart = await this.getCartById(cid)
        return updatedCart
    }

    async deleteCart(id) {
        let response = await CartsModel.findByIdAndDelete(id)
        return response
    }
}


export default CartManager