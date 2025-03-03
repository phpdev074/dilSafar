import mongoose from 'mongoose';
const { Schema } = mongoose;

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: false, 
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      // enum: [ 'TermAndCondition', 'PrivacyPolicy'],
    },
  },
  {
    timestamps: true, 
    collection: 'pages', 
  }
);

const Page = mongoose.model('Page', pageSchema);

export default Page;
