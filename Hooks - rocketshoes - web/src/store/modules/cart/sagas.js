import {call, put, select, all, takeLatest} from 'redux-saga/effects';
import {toast} from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import {formatPrice} from '../../../util/format';

import {addToCartSuccess, updateAmountSuccess} from './actions';

function* addToCart({id}) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast.error('Quantidade solicaitada fora de estoque');
    return;
  }

  if (productExists) {
    // const amount = productExists.amount + 1;
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
    history.push('/cart'); // REDIRECIONA O USUÁRIO PARA O CARRINHO AO ADICIONAR UM PRODUTO
  }
}

function* updateAmount({id, amount}) {
  if (amount <= 0) return;

  // const product = yield select(state => state.cart.find(p => p.id === id));

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount >= stockAmount) {
    toast.error('Quantidade solicitada fora do estoque');
    return;
  }
  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
