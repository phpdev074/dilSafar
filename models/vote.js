import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  optionId: { type: Schema.Types.ObjectId }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
