import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PrimeNGConfig } from 'primeng/api'
import { Aura } from 'primeng/themes/aura'

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'tz-root',
  template: `
    <header>
      <h1 class="text-yellow-400 font-bold text-center text-2xl p-5">Toolazon</h1>
    </header>

    <router-outlet></router-outlet>
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
