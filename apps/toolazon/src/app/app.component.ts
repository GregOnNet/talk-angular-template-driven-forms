import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PrimeNGConfig } from 'primeng/api'
import { Aura } from 'primeng/themes/aura'

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'tz-root',
  template: `
    <header class="bg-highlight">
      <h1 class="text-primary font-bold text-center text-2xl p-5">Toolazon</h1>
    </header>

    <main class="p-8">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  constructor(private primengConfig: PrimeNGConfig) {
    this.primengConfig.theme.set({
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities'
        }
      }
    })
  }
}
