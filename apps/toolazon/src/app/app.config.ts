import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import { appRoutes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideClientHydration(),
    provideRouter(appRoutes)
  ]
}
