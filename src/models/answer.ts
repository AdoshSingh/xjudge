import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  quesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'question',
    required: true
  },
  program: {
    type: Object
  },
  solution: {
    type:String
  }
});

export const Answer = mongoose.model('answer', answerSchema);