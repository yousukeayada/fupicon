import firebase from 'firebase'

import Vue from 'vue';
import Router from 'vue-router';
import Signin from "@/components/auth/Signin"
import Signup from "@/components/auth/Signup"
import MainView from '@/components/main/MainView'


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
        path: '/',
        name: 'main',
        component: MainView,
		meta: { requiresAuth: true }
    },
    {
        path: '/signin',
        name: 'signin',
        component: Signin
    },
    {
        path: '/signup',
        name: 'signup',
        component: Signup
    },
    
  ]
});

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if (requiresAuth) {
		// このルートはログインされているかどうか認証が必要です。
		// もしされていないならば、ログインページにリダイレクトします。
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				console.log(`fullPath: ${to.fullPath}`);
				next();
			} else {
				console.log(`fullPath: ${to.fullPath}`);
				console.log("router: not user");
				next({
					path: '/signin',
					query: { redirect: to.fullPath }
				});
			}
		})
	} else {
		console.log(`fullPath: ${to.fullPath}`);
		console.log("router: not requireAuth");
		next(); // next() を常に呼び出すようにしてください!
	}
});

export default router;
