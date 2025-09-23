import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NxWelcomeComponent } from './nx-welcome.component'
import { RegistrationViewComponent } from './registration.view'

@Component({
  imports: [NxWelcomeComponent, RouterModule, RegistrationViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected title = 'toolazon-signal-forms'
}
