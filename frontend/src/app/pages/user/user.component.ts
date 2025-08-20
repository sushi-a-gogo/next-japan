import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "@app/components/layout/layout.component";

@Component({
  selector: 'app-user',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {

}
