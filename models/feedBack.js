import mongoose from 'mongoose';
const { Schema } = mongoose;

const FeedBackSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        email: {
            type: String
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: 'feedBack',
    }
);

const feedBack = mongoose.model('feedBack', FeedBackSchema);

export default feedBack;
