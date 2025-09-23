import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'

import { RegistrationViewComponent } from './registration.view'

@Component({
  imports: [RouterModule, RegistrationViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected title = 'toolazon-signal-forms'
}
