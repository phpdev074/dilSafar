import mongoose from 'mongoose'
const {Schema} = mongoose;

const productSchema = new Schema({
    image:{type: String},
    title: { type: String },
    description: { type: String },
    price: { type: String },
    
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
