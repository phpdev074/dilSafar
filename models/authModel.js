import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    phone: { type: String },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    dob: { type: Date },
    gender: { type: String },
    image: { type: String },
    address: { type: String },
    socialType: { type: String },
    socialId: { type: String },
    bio:{type: String},
    otp: { type: String },
    isBlock:{type: Boolean, default: false},
    notification: { type: Boolean, default:true},
    isActive: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false},
    role:{type: String, default:"user"}
   
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
