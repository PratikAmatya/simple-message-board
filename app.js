const express = require('express');
const dotenv = require('dotenv');
const app = express();
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const messageBoardRoutes = require('./routes/messageBoard');
const signUpRoutes = require('./routes/signup');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cors = require('cors');
const Post = require('./models/Post');

dotenv.config({ path: 'config.env' });

// Setting view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(cors());

// Data Parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// database connection
const DB = process.env.DB_CONNECTION.replace(
	/<PASSWORD>/g,
	process.env.DB_PASSWORD
);

// Connecting to mongoDB
mongoose.connect(
	DB,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err) => {
		if (err) {
			console.log('ERROR OCCURED:' + err);
		} else {
			console.log('DB Connection Succesful');
		}
	}
);

app.get('*', checkUser);
app.use('/messageBoard', requireAuth, messageBoardRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/signup', signUpRoutes);
app.get('/messages', requireAuth, async (req, res) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (err) {
		res.status(400).json({ error: err });
	}
});

app.use((req, res) => {
	res.render('404');
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
