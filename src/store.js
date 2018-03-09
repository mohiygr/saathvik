import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    menu: [
      { title: 'Morkozhambu', category: 'flavour' },
      { title: 'Vathakozhambu', category: 'flavour' },
      { title: 'Paagakkaai Pitlai', category: 'side' },
      { title: 'Aviyal', category: 'side' },
      { title: 'Gandakasala White Rice', category: 'main' },
      { title: 'Mappillai Samba Red Rice', category: 'main' },
      { title: 'Akkaraivarisal', category: 'dessert' },
      { title: 'Pathir Peni', category: 'dessert' }
    ]
  }
})
