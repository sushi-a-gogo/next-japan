import { Component, inject, OnInit, output, signal } from '@angular/core';
import { AiService } from '@app/services/ai.service';
import { ButtonComponent } from '@app/shared/button/button.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-surprise',
  imports: [NgxSpinnerComponent, ButtonComponent],
  templateUrl: './surprise.component.html',
  styleUrl: './surprise.component.scss'
})
export class SurpriseComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private aiService = inject(AiService);

  ready = output<boolean>();
  dismiss = output();
  haiku = signal<string>('');

  ngOnInit(): void {
    this.spinner.show();
    this.aiService.generateHaiku$().subscribe((resp) => {
      this.haiku.set(resp.data);
      this.ready.emit(true);
    });
  }
}
