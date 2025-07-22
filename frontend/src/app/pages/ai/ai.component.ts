import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "@app/components/layout/layout.component";

@Component({
  selector: 'app-ai',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.scss'
})
export class AiComponent { }
