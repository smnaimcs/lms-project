const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms';
		await mongoose.connect(MONGODB_URI);
		console.log('MongoDB connected successfully!');
	} catch (error) {
		console.log('MongoDB connection error', error);
		process.exit(1);
	}
};

module.exports = connectDB;