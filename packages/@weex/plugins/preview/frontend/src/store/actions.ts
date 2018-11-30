import { Commit, Action, ActionTree } from 'vuex'
import * as types from './mutation-types'
import { State } from './index'

// const addToCart: Action<State, any> = (context: { commit: Commit }, product: Product) => {
//   if (product.inventory > 0) {
//     const payload: AddToCartPayload = {
//       id: product.id,
//     }
//     context.commit(types.ADD_TO_CART, payload)
//   }
// }

const actions: ActionTree<State, any> = {

}

export default actions
