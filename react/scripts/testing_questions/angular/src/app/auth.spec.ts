import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { AuthService, routes } from './auth'

describe('roleGuard', () => {
  async function open(user: { name: string; role: 'viewer' | 'admin' } | null) {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] })
    TestBed.inject(AuthService).user.set(user)
    const harness = await RouterTestingHarness.create()
    await harness.navigateByUrl('/admin')
    return harness.routeNativeElement?.textContent
  }

  it('sends a guest to /login', async () => {
    expect(await open(null)).toBe('Login')
  })
  it('sends a viewer to /unauthorized', async () => {
    expect(await open({ name: 'Asha', role: 'viewer' })).toBe('403: no access')
  })
  it('lets an admin in', async () => {
    expect(await open({ name: 'Ravi', role: 'admin' })).toBe('Admin panel')
  })
})
