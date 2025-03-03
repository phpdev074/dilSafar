import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    itemName: { type: String },
    categoryId: { type: String, enum:["Electronics","Clothing & Fashion","Home & Kitchen","Beauty & Personal Care","Sports & Fitness","Automobiles & Accessories","Books & Stationery","Toys & Games","Food & Beverages"]},
    salePrice: { type: String, },
    files: [{ file: { type: String }, type: { type: String, enum: ['image', 'video'], default: "image" } }],
    discount: { type: String },
    dealInfo: { type: String },
    totalprice: {type: String},
    storeName:{type: String},
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: undefined }
    },
    endDate:{type: Date},
    description: { type: String}
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });
const Post = mongoose.model('Post', userSchema);

export default Post;
