import React from 'react';
import { TextField, List, ListItem, ListItemText, ListItemIcon, Tooltip, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { Inventory, LocalShipping } from '@mui/icons-material';
import { faker } from '@faker-js/faker';

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

  filterProductByName({ target: { value }}) {
    this.setState({
      products: PRODUCTS.filter(({ name }) => name.toLowerCase().match(value.toLowerCase()))
    })
  }

  filterProductByStock({ target: { checked }}) {
    this.setState({
      products: PRODUCTS.filter(({ stock }) => stock > 0 || checked)
    })
  }

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

  renderProducts() {
    return this.state.products.map(product => (
      <ListItem key={product.uuid}>
        {this.renderStockIcon(product.stock)}
        <ListItemText primary={product.name} secondary={"stock: " + product.stock}/>
        <ListItemText primary={product.price + " €"} className='price'/>
      </ListItem>
    ));
  }

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

function generateMultipleProducts(max) {
  let products = [];
  for (let i = 0; i < max; i++)
    products.push(generateProduct())
  return products;
}

function generateProduct(overwriteStock) {
  return {
    uuid: faker.datatype.uuid(),
    name: faker.commerce.product(),
    price: faker.commerce.price(0.50, 200),
    stock: overwriteStock ?? Math.floor(Math.random() * 5)
  };
}
