import { Route } from '@angular/router'

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/registration' },
  {
    path: 'registration',
    loadComponent: () => import('./registration.view').then(m => m.RegistrationViewComponent)
  },
  {
    path: 'shopping-list',
    loadComponent: () => import('./shopping-list.view').then(m => m.ShoppingListViewComponent)
  }
]
