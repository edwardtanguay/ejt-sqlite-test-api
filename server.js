import express from 'express';

const app = express();
const port = 3345;

app.get('/', (req, res) => {
	res.send(`<h1>SQLite API</h1>`);
})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
})