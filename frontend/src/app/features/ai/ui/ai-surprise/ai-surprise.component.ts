import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AiService } from '@app/features/ai/services/ai.service';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ai-surprise',
  imports: [NgxSpinnerComponent, ButtonComponent],
  templateUrl: './ai-surprise.component.html',
  styleUrl: './ai-surprise.component.scss'
})
export class AiSurpriseComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private destroyRef = inject(DestroyRef);
  private aiService = inject(AiService);

  ready = output<boolean>();
  dismiss = output();
  haiku = signal<string>('');

  ngOnInit(): void {
    this.spinner.show();
    this.aiService.generateHaiku$().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      if (res.success && res.data) {
        this.haiku.set(res.data);
      }
      this.ready.emit(true);
    });
  }
}
