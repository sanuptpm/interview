import { Component, Injectable, inject, signal } from '@angular/core'
import { CanActivateFn, Router, Routes } from '@angular/router'

export interface User { name: string; role: 'viewer' | 'admin' }

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<User | null>(null)
}

// Route data says which roles may open the page
export const roleGuard: CanActivateFn = (route) => {
  const user = inject(AuthService).user()
  const router = inject(Router)
  if (!user) return router.createUrlTree(['/login'])
  const roles: string[] = route.data['roles'] ?? []
  return roles.length === 0 || roles.includes(user.role) ? true : router.createUrlTree(['/unauthorized'])
}

@Component({ selector: 'app-admin', template: '<h1>Admin panel</h1>' }) export class AdminPage {}
@Component({ selector: 'app-login', template: '<h1>Login</h1>' }) export class LoginPage {}
@Component({ selector: 'app-unauthorized', template: '<h1>403: no access</h1>' }) export class UnauthorizedPage {}

export const routes: Routes = [
  { path: 'admin', component: AdminPage, canActivate: [roleGuard], data: { roles: ['admin'] } },
  { path: 'login', component: LoginPage },
  { path: 'unauthorized', component: UnauthorizedPage },
]
