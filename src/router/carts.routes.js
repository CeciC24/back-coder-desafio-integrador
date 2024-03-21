import { Router } from 'express';
import CartManager from '../dao/services/CartManager.js';

const CartMngr = new CartManager()
const CartsRouter = Router()

CartsRouter.post("/", async (req, res) => {
    try {
        let newCart = await CartMngr.addCart()
        res.send(newCart)
    } catch (error) {
        res.status(500).send({ error: 'Error al crear carrito' })
    }
})

CartsRouter.get("/", async (req, res) => {
    try {
        res.send(await CartMngr.getCarts())
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener carritos' })
    }
})

CartsRouter.get("/:cid", async (req, res) => {
    let cid = req.params.cid

    try {
        res.send(await CartMngr.getCartById(cid))
    } catch (error) {
        res.status(404).send({ error: 'Carrito no encontrado' })
    }
})

CartsRouter.post("/:cid/product/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid

    try {
        res.send(await CartMngr.addProductToCart(cid, pid))
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar producto al carrito' })
    }
})

export default CartsRouter