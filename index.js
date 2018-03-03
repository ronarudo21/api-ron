const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Product = require('./models/product')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
    res.send({ message: `Hola jojo` })
    // res.end()
});
app.get('/test/:name', (req, res) => {
    res.send({ message: `Hola ${req.params.name}` })
    // res.end()
});

app.get('/api/product', (req, res) => {
    // res.send(200, {products: []})

    Product.find({}, (err, products) => {
        if (err) res.status(500).send({
            message: `Error al traer los productos ${err}`
        })
        if (!products) res.status(404).send({ message: `No existen productos` })

        res.status(200).send({ products })
    })

});

app.get('/api/product/:productId', (req, res) => {
    let productId = req.params.productId;

    Product.findById(productId, (err, product) => {
        if (err) res.status(500).send({
            message: `Error al traer el producto ${err}`
        })
        if (!product) res.status(404).send({ message: `El producto no existe` })

        res.status(200).send({ product })
    })
});

app.post('/api/product', (req, res) => {
    console.log(req.body);
    const body = req.body;

    let product = new Product();
    product.name = body.name
    product.picture = body.picture
    product.price = body.price
    product.category = body.category
    product.description = body.description

    product.save((err, productStored) => {
        if (err) res.status(500).send({ message: 'Error al salvar el producto en la BD: ' + err })

        res.status(200).send({ product: productStored })

    });

    //res.status(200).send({ message: `El producto se ha recibido` })
});

app.put('/api/product/:productId', (req, res) => {
    let productId = req.params.productId;
    let update = req.body;

    Product.findByIdAndUpdate(productId, update, (err, productUpdate) => {
        if (err) res.status(500).send({
            message: `Error al actualziar el producto ${err}`
        })

        if (!productUpdate) res.status(404).send({ message: `El producto no existe` })

        res.status(200).send({ product: productUpdate })
    })
});

app.delete('/api/product/:productId', (req, res) => {
    let productId = req.params.productId;

    Product.findById(productId, (err, product) => {
        if (err) res.status(500).send({
            message: `Error al borrar el producto ${err}`
        })

        if (!product) res.status(404).send({ message: `El producto no existe` })

        product.remove(err => {
            if (err) res.status(500).send({
                message: `Error al borrar el producto ${err}`
            })
            res.status(200).send({ message: 'El producto ha sido eliminado' })
        })
    })
});

mongoose.connect('mongodb://localhost:27017/shop', (err, res) => {
    // if (err) throw err
    if (err) {
        return console.log("Error en conectar a la base de datos: " + err);
    }

    console.log("Conexión a la base de datos establecida...");

    app.listen(port, () => {
        console.log("Open port " + port);
    });

})
