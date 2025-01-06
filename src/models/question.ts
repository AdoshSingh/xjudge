import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
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
  },
  program: {
    type: Object
  }
});

export const Question = mongoose.model('question', questionSchema);
