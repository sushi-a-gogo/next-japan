import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "@app/core/layout/layout.component";

@Component({
  selector: 'app-ai',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class AiComponent { }
