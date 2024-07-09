import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

let products = [];
let idCounter = 1;

app.get('/api/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * 5;
    const endIndex = page * 5;

    const resultProducts = products.slice(startIndex, endIndex);

    const response =  resultProducts;

    res.json(response);
});

app.post('/api/products', (req, res) => {
    const product = { id: idCounter++, ...req.body };
    products.push(product);
    res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body, id: +req.body.id };
        console.log(req.body)
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});