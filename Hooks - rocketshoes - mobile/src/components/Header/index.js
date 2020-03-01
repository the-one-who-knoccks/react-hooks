/* eslint-disable react/prop-types */
import React from 'react';
import {useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Wrapper,
  Container,
  ContainerLogo,
  Logo,
  BasketContainer,
  ItemCount,
} from './styles';

export default function Header({navigation}) {
  const cartSize = useSelector(state => state.cart.length);
  return (
    <Wrapper>
      <Container>
        <ContainerLogo onPress={() => navigation.navigate('Main')}>
          <Logo />
        </ContainerLogo>
        <BasketContainer onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-basket" color="#FFF" size={24} />
          <ItemCount>{cartSize || 0}</ItemCount>
        </BasketContainer>
      </Container>
    </Wrapper>
  );
}

// export default connect(
//   state => ({
//     cartSize: state.cart.length,
//   }),
//   null
// )(Header);
