const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let orders = [];

// Endpoint to get all orders or filter by username query param
app.get('/api/orders', (req, res) => {
  const username = req.query.username;
  if (username) {
    const userOrders = orders.filter(order => order.username === username);
    res.json(userOrders);
  } else {
    res.json(orders);
  }
});

// Endpoint to submit a new order
app.post('/api/orders', (req, res) => {
  const newOrders = req.body.orders;
  if (!Array.isArray(newOrders)) {
    return res.status(400).json({ error: 'Orders should be an array' });
  }
  newOrders.forEach(order => {
    order.status = 'Pending';
    orders.push(order);
  });
  res.json({ message: 'Orders received', count: newOrders.length });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
