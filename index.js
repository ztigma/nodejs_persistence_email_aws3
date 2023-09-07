const express = require('express');
const app = express();

require('./async');

app.get('/', async  (req, res) => 
{
	let data = await 'db/test_db.json'.ASYNC_GET_PERSISTENCE();
	res.send
	(
		data
	);
});

app.listen(3000, () => {
  console.log('server started');
});
