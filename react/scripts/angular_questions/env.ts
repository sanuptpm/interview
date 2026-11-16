// Minimal Angular environment for running examples in Node (no browser, no zone.js).
// Gives effect(), toSignal(), resource() and HttpClient a real root injector to live in.
import '@angular/compiler'
import {
  DOCUMENT, EnvironmentInjector, Injector, NgZone, createEnvironmentInjector, inject,
  ɵChangeDetectionScheduler as Scheduler, ɵEffectScheduler as EffectScheduler,
  ɵINJECTOR_SCOPE as SCOPE, ɵNoopNgZone as NoopNgZone,
} from '@angular/core'
import { provideHttpClient, withFetch } from '@angular/common/http'

export const root = Injector.create({
  providers: [
    { provide: SCOPE, useValue: 'root' },
    { provide: NgZone, useClass: NoopNgZone },
    { provide: DOCUMENT, useValue: { getElementById: () => null } },
    { provide: EnvironmentInjector, useFactory: () => inject(Injector) },
    // Root effects are flushed in a microtask, like Angular does between change detection runs.
    { provide: Scheduler, useValue: { notify: () => queueMicrotask(() => root.get(EffectScheduler).flush()), runningTick: false } },
  ],
}) as unknown as EnvironmentInjector

export const injector = createEnvironmentInjector([provideHttpClient(withFetch())], root)

export const settle = async (ms = 0) => {
  for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, ms))
}
