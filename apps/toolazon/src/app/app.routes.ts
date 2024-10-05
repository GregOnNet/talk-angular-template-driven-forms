import { Route } from '@angular/router'

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/registration' },
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.view')
  },
  {
    path: 'shopping/list',
    loadComponent: () => import('./shopping/shopping/shopping-list.view')
  },
  {
    path: 'shopping/basket',
    loadComponent: () => import('./shopping/shopping-basket/shopping-basket.view')
  },
  {
    path: 'checkout/summary',
    loadComponent: () => import('./checkout/checkout-summary/checkout-summary.view')
  },
  {
    path: 'checkout/confirmation',
    loadComponent: () => import('./checkout/checkout-confirmation/checkout-confirmation.view')
  }
]
