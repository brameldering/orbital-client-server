import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { Message, ErrorMessage } from '../../components/general/Messages';
import Rating from '../../components/product/Rating';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../../slices/productsApiSlice';
import { addToCart } from '../../slices/cartSlice';
import { CURRENCY_SYMBOL } from '../../constantsFrontend';
import type { RootState } from '../../store';
import { CartItem } from '../../types/cartTypes';

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  let productId: string = '';
  if (id && id.length > 0) {
    productId = id;
  }

  const queryParams = new URLSearchParams(window.location.search);
  const goBackPath = queryParams.get('goBackPath') || '/';

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error: errorLoading,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const addToCartHandler = () => {
    if (product) {
      const cartItem: CartItem = {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 0,
      };
      dispatch(addToCart({ ...cartItem, qty }));
      navigate('/cart');
    }
  };

  const [
    createReview,
    { isLoading: creatingProductReview, error: errorCreatingReview },
  ] = useCreateReviewMutation();

  const submitReviewHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ratingNr = Number(rating);
    try {
      await createReview({
        productId,
        rating: ratingNr,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created');
    } catch (err) {
      // Do nothing because useCreateReviewMutation will set errorCreatingReview in case of an error
    }
  };

  const buttonDisabled = isLoading || creatingProductReview;

  return (
    <>
      <Link className='btn btn-light my-3' to={goBackPath}>
        Go Back
      </Link>
      {errorCreatingReview && <ErrorMessage error={errorCreatingReview} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
      ) : product ? (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: {CURRENCY_SYMBOL}
                  {Number(product.price).toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  Product Id: {product.sequenceProductId}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>
                          {CURRENCY_SYMBOL}
                          {Number(product.price).toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}>
                            {/* The following creates an array starting with 0 to countinStock-1:
                                [...Array(product.countInStock).keys()] */}
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className='btn-block mt-2'
                      type='button'
                      disabled={product.countInStock === 0 || buttonDisabled}
                      onClick={addToCartHandler}>
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && (
                <Message variant='info'>No Reviews</Message>
              )}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {creatingProductReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}>
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          required
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={buttonDisabled}
                        type='submit'
                        variant='primary mt-2'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant='info'>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      ) : (
        <p>This should never be shown</p>
      )}
    </>
  );
};

export default ProductScreen;