import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  content: { type: String },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
