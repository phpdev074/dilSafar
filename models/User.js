import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    countryCode: { type: String },
    phone: { type: String },
    iso:{type: String },
    list: { type: [String] },
    socialType: { type: String },
    socialId: { type: String },
    dob: { type: Date },
    bio:{type: String},
    gender: { type: String },
    image: { type:[ String] },
    otp: { type: String },
    isForgotOtp:{type:String},
    otpExpires:{type: String },
    myProfileStatus: { type: Boolean, default: false},
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
