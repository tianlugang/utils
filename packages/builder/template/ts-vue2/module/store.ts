import { GetterTree, MutationTree, ActionTree } from 'vuex'
import * as _capitalized_Model from './_capitalized_.model'
import { _capitalized_State } from '@/types/pages/_page_/_capitalized_.types'

const state: _capitalized_State = {
  name: '_name_'
}

// 强制使用getter获取state
const getters: GetterTree<_capitalized_State, any> = {
  name: (state: _capitalized_State) => state.name
}

// 更改state
const mutations: MutationTree<_capitalized_State> = {
  // 更新state都用该方法
  UPDATE_STATE(state: _capitalized_State, data: _capitalized_State) {
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { return }
      (<any>state)[key] = (<any>data)[key]
    }
  }
}

const actions: ActionTree<_capitalized_State, any> = {
  UPDATE_STATE_ASYNC({ commit, state: _capitalized_State }, data: _capitalized_State) {
    commit('UPDATE_STATE', data)
  },
  // GET_DATA_ASYNC({ commit, state: any }) {
  //   _capitalized_Model.getData()
  // }
}

export default {
    state,
    getters,
    mutations,
    actions
}
