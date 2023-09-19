import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { CURRENCY_SYMBOL } from '../../constantsFrontend';
import Rating from './Rating';
import { ProductType } from '../../types/productTypes';

interface ProductComponentProps {
  product: ProductType;
}

const Product: React.FunctionComponent<ProductComponentProps> = ({
  product,
}) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          alt={product.name}
          variant='top'
          img-fluid
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>
          {CURRENCY_SYMBOL}
          {Number(product.price).toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;