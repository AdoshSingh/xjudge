import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type:String,
    required: true,
  },
  statement: {
    type: String,
    required: true
  },
  examples: [
    {
      input: {
        type: Object,
        required: true
      },
      output: {
        type: String,
        required: true
      }
    }
  ],
  constraints: {
    type: [String]
  },
  testcases: {
    type: String
  }
});

export const Question = mongoose.model('question', questionSchema);
