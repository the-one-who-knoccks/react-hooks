/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

// import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import * as CartActions from '../../store/modules/cart/actions';

import api from '../../services/api';

import { formatPrice } from '../../util/format';

import {
  Container,
  Box,
  Image,
  Title,
  Price,
  Button,
  AddCart,
  NumberItensCart,
  TextButton,
  Span,
} from './styles';

export default function Main({id}) {

  const [products, setProducts] = useState([]);
  const productLoaded = useSelector(state =>state.cart.reduce((productLoaded, product) => {
    productLoaded[product.id] = product.loaded;

    return productLoaded;
  }, {}))
  const amount = useSelector(state => state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),


  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products');
      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
    }
    loadProducts()
  }, []));

  const dispatch = useDispatch();


  function handleNavigate(id) {
    dispatch(CartActions.addToRequestCart(id));
  };

    if (!products) {
      return (
        <Container>
          <Span>Nenhum produto encontrado.</Span>
        </Container>
      );
    }

  return (
    <Container>
      <FlatList
        data={products}
        extraData={[amount, id, productLoaded]}
        keyExtractor={product => String(product.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Box>
            <Image source={{ uri: item.image }} />
            <Title>{item.title}</Title>
            <Price>{item.priceFormatted}</Price>
            <Button onPress={() => handleNavigate(item.id)}>
              <AddCart>
                <Icon name="add-shopping-cart" size={16} color="#FFF" />
                <NumberItensCart>{amount[item.id] || 0}</NumberItensCart>
              </AddCart>
              <TextButton>
                <Span>Adicionar</Span>
              </TextButton>
            </Button>
          </Box>
        )}
      />
    </Container>
  );
}

// // const mapStateToProps = state => ({
// //   amount:
// // });

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(CartActions, dispatch);

// export default connect(
//   null,
//   // mapStateToProps,
//   mapDispatchToProps
// )(Main);
