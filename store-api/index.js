const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const hbs = require('express-handlebars').create({});

const products = require('./products');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/products/', function (req, res) {
  res.status(200).send(filterProducts(req.query, products));
});

app.get('/products/:productId', function (req, res) {
  const productId = req.params.productId;
  const product = products.find(product => product.id === productId);
  if (product) {
    res.render('product', product)
  } else {
    res.status(404).send({ code: 404, messasge: 'NOT_FOUND' });
  }
});

app.listen(app.get('port'), function () {
  console.log('App running on port', app.get('port'))
});

const filterProducts = (query, products) => {
  let filteredProducts = products;

  if (query.gender) {
    filteredProducts = filteredProducts.filter(product => product.gender === query.gender);
  }

  if (query.size) {
    filteredProducts = filteredProducts.filter(product => {
      const availableSizes = product.availableSizes;
      return availableSizes.indexOf(query.size) > -1;
    });
  }
  return filteredProducts;
}