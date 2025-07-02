import { Component } from '@angular/core';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';

@Component({
  selector: 'app-not-found',
  imports: [PageErrorComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
}
