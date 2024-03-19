import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import ViewsRouter from './router/views.routes.js'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'
import ProductManager from './controllers/ProductManager.js'

const app = express()

const ProductMngr = new ProductManager('src/models/products.json')

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', ViewsRouter)
app.use('/api/products', ProductRouter)
app.use('/api/cart', CartRouter)

const PORT = 8080
const server = app.listen(PORT, () => {
	console.log(`Server running in port ${server.address().port}`)
})

const io = new Server(server)

server.on('error', (error) => console.error(`Server error: ${error}`))

io.on('connection', (socket) => {
	console.log('Nuevo cliente conectado')

	socket.on('addProduct', async (product) => {
		try {
			const productAdded = await ProductMngr.addProduct(product)
			io.emit('addToTheList', productAdded)

		} catch (error) {
			console.error(error.message)
		}
	})

	socket.on('deleteProduct', async (productID) => {
		try {
			await ProductMngr.deleteProduct(productID)
			io.emit('deleteFromList', productID)
			
		} catch (error) {
			console.error(error.message)
		}
	})
})
