import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/core/services/dialog.service';
import { AiService } from '@app/features/ai/services/ai.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
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
  private dialogService = inject(DialogService);

  data = input();
  haiku = signal<string>('');

  ngOnInit(): void {
    this.spinner.show();
    this.aiService.generateHaiku$().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      if (res.success && res.data) {
        this.haiku.set(res.data);
      }
    });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }

}
