import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@app/core/services/dialog.service';
import { AiService } from '@app/features/ai/services/ai.service';
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

const LOADING_MESSAGES = [
  'Hold on a minute...',
  'The muse is thinking...',
  'Almost there...',
  'So close now...',
  'OK maybe a little longer...',
  'Must be making something extra special!',
  'AI can be slow at times - hang in there!',
];

@Component({
  selector: 'app-ai-surprise',
  imports: [NgxSpinnerComponent, NextButtonComponent, MatButtonModule],
  templateUrl: './ai-surprise.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './ai-surprise.component.scss'
})
export class AiSurpriseComponent implements OnInit {
  private spinner = inject(NgxSpinnerService);
  private destroyRef = inject(DestroyRef);
  private aiService = inject(AiService);
  private dialogService = inject(DialogService);

  data = input();
  haiku = signal<string>('');

  messageIndex = signal(0);
  message = signal(LOADING_MESSAGES[0]);
  messageState = signal<'idle' | 'exit' | 'jump'>('idle');

  private rotationTimer?: ReturnType<typeof setInterval>;
  private transitionTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.spinner.show();
    this.startMessageRotation();

    this.aiService.generateHaiku$().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res) => {
      this.stopMessageRotation();
      if (res.success && res.data) {
        this.haiku.set(res.data);
      }
    });
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }

  private startMessageRotation() {
    this.rotationTimer = setInterval(() => this.advanceMessage(), 5000);
    this.destroyRef.onDestroy(() => this.stopMessageRotation());
  }

  private stopMessageRotation() {
    clearInterval(this.rotationTimer);
    clearTimeout(this.transitionTimer);
  }

  private advanceMessage() {
    this.messageState.set('exit');
    this.transitionTimer = setTimeout(() => {
      this.messageIndex.update((i) => (i + 1) % LOADING_MESSAGES.length);
      this.message.set(LOADING_MESSAGES[this.messageIndex()]);
      this.messageState.set('jump');
      requestAnimationFrame(() => this.messageState.set('idle'));
    }, 350);
  }
}
