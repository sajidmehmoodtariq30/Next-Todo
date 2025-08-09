import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  category: {
    type: String,
    trim: true,
    maxLength: [30, 'Category cannot be more than 30 characters'],
    default: 'general'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better performance
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Todo || mongoose.model('Todo', todoSchema);
