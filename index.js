const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const userRouter = require('./routes/users');

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/user', userRouter);

mongoose
	.connect(process.env.MONGO_URI)
	.then((res) => {
		console.log('Mongodb connected....');
	})
	.catch((err) => {
		console.log(err);
	});
app.listen(port, () => {
	console.log(
		`Server is running at port ${port}`
	);
});
