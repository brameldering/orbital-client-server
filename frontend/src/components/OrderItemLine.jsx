import { Row, Col, Image } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { CURRENCY_SYMBOL } from '../constants';

const OrderItemLine = (itemProps) => {
  const currentPath = useLocation().pathname;
  const productId = itemProps.productId;
  const item = itemProps.item;
  return (
    <Row>
      <Col md={1}>
        <Image src={item.image} alt={item.name} fluid rounded />
      </Col>
      <Col>
        <Link to={`/product/${productId}?goBackPath=${currentPath}`}>
          {item.name}
        </Link>
      </Col>
      <Col md={4}>
        {item.qty} x {CURRENCY_SYMBOL}
        {item.price} = {CURRENCY_SYMBOL}
        {item.qty * item.price}
      </Col>
    </Row>
  );
};

export default OrderItemLine;