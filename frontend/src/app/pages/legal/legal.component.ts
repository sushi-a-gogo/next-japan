import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "@app/components/layout/layout.component";

@Component({
  selector: 'app-legal',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss'
})
export class LegalComponent {

}
