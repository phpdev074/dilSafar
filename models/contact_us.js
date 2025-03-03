import mongoose from 'mongoose';
const { Schema } = mongoose;

const contactusSchema = new Schema(
  {
    email: {
      type: String
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'Contact_Us',
  }
);

const Contact_Us = mongoose.model('Contact_Us', contactusSchema);

export default Contact_Us;
