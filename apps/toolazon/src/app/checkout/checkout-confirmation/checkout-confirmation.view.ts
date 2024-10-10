import { afterNextRender, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import confetti from 'canvas-confetti'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'tz-checkout-confirmation',
  standalone: true,
  template: `
    <div class="grid gap-8 items-center place-content-center">
      <header class="leading-10">
        <h2 class="text-5xl">Thank you!</h2>
        <p>The next tool shop prepares your delivery, already.</p>
      </header>
      <p-button
        label="Shop more"
        size="large"
        routerLink="/shopping/list"
      ></p-button>
    </div>
  `,
  imports: [ButtonModule, RouterLink]
})
export default class CheckoutConfirmationView {
  constructor() {
    afterNextRender(() => {
      this.#fireConfetti(0.25, {
        spread: 26,
        startVelocity: 55
      })
      this.#fireConfetti(0.2, {
        spread: 60
      })
      this.#fireConfetti(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      })
      this.#fireConfetti(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      })
      this.#fireConfetti(0.1, {
        spread: 120,
        startVelocity: 45
      })
    })
  }

  #fireConfetti(
    particleRatio: number,
    config: Partial<{ spread: number; startVelocity: number; decay: number; scalar: number }>
  ) {
    const count = 200
    const defaults = { origin: { y: 0.7 } }

    confetti(
      Object.assign({}, defaults, config, {
        particleCount: Math.floor(count * particleRatio)
      })
    )
  }
}
