import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home.vue';
import Cliente from '@/components/view/Cliente.vue';
import Livro from '@/components/view/Livro.vue'
import Aluguel from '@/components/view/Aluguel.vue'
import Reserva from '@/components/view/Reserva.vue'
import Retirar from '@/components/view/Retirar.vue'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/home',
    component: Home
},
{
    name: 'cliente',
    path: '/cliente',
    component: Cliente
},
{
    name: 'livro',
    path: '/livro',
    component: Livro
},
{
    name: 'aluguel',
    path: '/aluguel',
    component: Aluguel
},
{
    name: 'reserva',
    path: '/reserva',
    component: Reserva
},
{
    name: 'retirar',
    path: '/retirar',
    component: Retirar
}
]

 const router = new VueRouter({
    mode: 'history',
    routes
})


export default router