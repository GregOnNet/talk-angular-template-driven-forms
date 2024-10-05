import { afterNextRender, Component } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { RouterLink } from '@angular/router'
import confetti from 'canvas-confetti'

@Component({
  selector: 'tz-checkout-confirmation',
  standalone: true,
  template: `
    <p-button
      label="Back to overview"
      routerLink="/shopping/list"
    ></p-button>
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
