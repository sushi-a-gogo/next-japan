import { Component } from '@angular/core';
import { PageErrorComponent } from '@app/components/page-error/page-error.component';
import { FooterComponent } from "@app/shared/footer/footer.component";

@Component({
  selector: 'app-not-found',
  imports: [PageErrorComponent, FooterComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
