import Vue from "vue"
import VueRouter from "vue-router"

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childComps/Welcome')
const UserList = () => import('views/user/UserList')
const Role = () => import('views/right/Role')
const Right = () => import('views/right/Right')
const Cate = () => import('views/goods/goodsCate')
const Params = () => import('views/goods/goodsParams')
const GoodsList = () => import('views/goods/goodsList')
const GoodsAdd = () => import('views/goods/goodsAdd')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: UserList,
      },
      {
        path: '/roles',
        component: Role,
      },
      {
        path: '/rights',
        component: Right,
      },
      {
        path: '/categories',
        component: Cate,
      },
      {
        path: '/params',
        component: Params,
      },
      {
        path: '/goods',
        component: GoodsList,
      },
      {
        path: '/goods/add',
        component: GoodsAdd,
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router