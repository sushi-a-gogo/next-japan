import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppLogoComponent } from "@app/core/ui/app-logo/app-logo.component";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AppLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class FooterComponent {
}
