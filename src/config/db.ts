import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://oskarfdz111:l32D60TlvBXLqBup@wellfit-admin.xzj4f.mongodb.net/?retryWrites=true&w=majority&appName=wellfit-admin');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Termina el proceso si falla la conexión
  }
};

export default connectDB;