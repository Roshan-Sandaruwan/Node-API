const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const Product = require('./models/productModel')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Routes
app.get('/', (req, res) => {
  res.send('Hello world!')
})

//check in body
// app.post('/product',(req,res)=>{
//   console.log(req.body);
//   res.send(req.body);
// })

// CREATE product
app.post('/products',async(req,res)=>{
  try{
    const product = await Product.create(req.body)
    res.status(200).json(product);
  }catch(error){
    console.log(error.message);
    res.status(500).json({message:error.message})
  }
})


// VIEW all products details in DB
app.get('/products',async(req,res)=>{
  try {
    const product = await Product.find({});
    res.status(200).json(product);
    
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


//VIEW specific product details using id
app.get('/products/:id',async(req,res)=>{
  try {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
});


// UPDATE a product
app.put('/products/:id',async(req,res)=>{
  try {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,req.body)
    if(!product){
      return res.status(404).json({message: `Cannot find any product with id ${id}`})
    }
    const updatedProduct = await Product.findById(id)
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
});



// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: `Cannot find any product with id ${id}` });
    }
    res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Connect DB
mongoose.connect('mongodb+srv://roshan:12345@cruddb.9ticcs3.mongodb.net/node-api?retryWrites=true&w=majority&appName=cruddb')
.then(()=>{
  console.log('Connected!')
  app.listen(port, () => {
    console.log(`app listening on port ${port} `)
  })
}).catch((error)=>{
  console.log(error)
})