import React from 'react';
import { TextField, List, ListItem, ListItemText, ListItemIcon, Tooltip, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { Inventory, LocalShipping } from '@mui/icons-material';
import { faker } from '@faker-js/faker';

// Generate globally a list of mock product
// Can be refactor to store it using Redux
faker.setLocale('fr');
const PRODUCTS = generateMultipleProducts(15);
PRODUCTS.push(generateProduct(0));

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: PRODUCTS
    }
  }

  /**
   * Sort state product by name
   * 
   * @param {Event} value 
   */
  filterProductByName({ target: { value }}) {
    this.setState({
      products: PRODUCTS.filter(({ name }) => name.toLowerCase().match(value.toLowerCase()))
    })
  }

  /**
   * Sort state product by stock.
   * If checked is false, remove product with no stock.
   * 
   * @param {Event} value 
   */
  filterProductByStock({ target: { checked }}) {
    this.setState({
      products: PRODUCTS.filter(({ stock }) => stock > 0 || checked)
    })
  }

  /**
   * Render Product icon and tooltip
   * 
   * @param {number} stock 
   * @returns JSX product icon
   */
  renderStockIcon(stock) {
    if (stock > 0)
      return (
        <Tooltip title="En stock" placement="top">
          <ListItemIcon><Inventory /></ListItemIcon>
        </Tooltip>
      )
    else
    return (
      <Tooltip title="Réapprovisionnement" placement="top">
        <ListItemIcon><LocalShipping /></ListItemIcon>
      </Tooltip>
    )
  }

  /**
   * Render list of product
   * 
   * @returns JSX product list
   */
  renderProducts() {
    return this.state.products.map(product => (
      <ListItem key={product.uuid}>
        {this.renderStockIcon(product.stock)}
        <ListItemText primary={product.name} secondary={"stock: " + product.stock}/>
        <ListItemText primary={product.price + " €"} className='price'/>
      </ListItem>
    ));
  }

  /**
   * Render main component content. Filter form + product list
   * 
   * @returns JSX main content
   */
  render() {
    return <>
      <FormGroup>
        <TextField id="outlined-basic" label="Chercher un produit" variant="outlined" onChange={this.filterProductByName.bind(this)}/>
        <FormControlLabel control={<Switch onChange={this.filterProductByStock.bind(this)} defaultChecked />} label="Afficher les produits en rupture de stock" />
      </FormGroup>
      <List sx={{ maxHeight: 500, overflow: 'auto' }}>{this.renderProducts()}</List>
    </>;
  }
}

/**
 * Loop over a maximum product amout
 * and use generateProduct() to generate a list of product.
 * 
 * @param {number} max Amout of product generated
 * @returns array of product
 */
function generateMultipleProducts(max) {
  let products = [];
  for (let i = 0; i < max; i++)
    products.push(generateProduct())
  return products;
}

/**
 *  Use faker lib to generate a product object.
 *
 * @param {number} overwriteStock Used to set product's stock amout.
 * @returns product object
 */
function generateProduct(overwriteStock = null) {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.commerce.product(),
    price: faker.commerce.price(0.50, 200),
    stock: overwriteStock ?? Math.floor(Math.random() * 5)
  };
}
