import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <header>
      <h1 class="text-red-500">Toolazon</h1>
    </header>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private primengConfig: PrimeNGConfig) {
    this.primengConfig.theme.set({
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });
  }
}
