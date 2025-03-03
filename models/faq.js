import mongoose from "mongoose";
const { Schema } = mongoose;

const faqSchema = new Schema({

  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
}
);

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;
