import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let products = [];
let idCounter = 1;
const limit = 5;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({ storage: storage });



app.get('/api/products', (req, res) => {
    const { page = 1, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let filteredProducts = products;
    
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    const paginatedProducts = filteredProducts.slice(offset, offset + parseInt(limit));
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit);
  
    res.json({ products: paginatedProducts, currentPage: parseInt(page), totalItems, totalPages });
});

app.post('/api/products', upload.single('file'), (req, res) => {
    try {
        const { name, description, price } = req.body;
        const file = req.file;

        const newProduct = {
        name,
        description,
        price,
        imageUrl: file ? `http://localhost:5000/uploads/${file.filename}` : null
        };

        console.log('Product created:', newProduct);

        products.push({id: idCounter++, ...newProduct});
        // Respond with the created product
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/products/:id', upload.single('file'), (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const file = req.file;
  
      // Find the product by id
      const productIndex = products.findIndex(p => p.id == id);
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Update product details
      const updatedProduct = {
        ...products[productIndex],
        name,
        description,
        price,
        imageUrl: file ? `http://localhost:5000/uploads/${file.filename}` : products[productIndex].file
      };
  
      // Replace the old product with the updated product
      products[productIndex] = updatedProduct;
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).end();
});

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});