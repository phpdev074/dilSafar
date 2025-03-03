import mongoose from 'mongoose'
const {Schema} = mongoose;

const userSchema = new Schema({
    name: { type: String },
    description: { type: String },
    image: { type: String },
    
}, {
    timestamps: true
});

const Category = mongoose.model('Category', userSchema);

export default Category;
