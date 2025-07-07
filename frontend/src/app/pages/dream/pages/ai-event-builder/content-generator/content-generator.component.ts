import { TextFieldModule } from '@angular/cdk/text-field';
import { TitleCasePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationStart, Router } from '@angular/router';
import { AiEvent } from '@app/pages/event/models/ai-event.model';
import { AiService } from '@app/services/ai.service';
import { AuthMockService } from '@app/services/auth-mock.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-content-generator',
  imports: [TitleCasePipe, FormsModule, MatProgressBarModule, MatRippleModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule],
  templateUrl: './content-generator.component.html',
  styleUrl: './content-generator.component.scss'
})
export class ContentGeneratorComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthMockService);
  private aiService = inject(AiService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  promptForm?: FormGroup;
  eventCreated = output<AiEvent>();

  busy = signal<boolean>(false);
  error = signal<string | null>(null);

  aiProvider: 'OpenAI' | 'Grok' = 'OpenAI'
  customText = '';

  tones = ['adventurous', 'serene', 'nostalgic', 'magical', 'dreamy', 'festive', 'rustic', 'exotic'];
  moods = ['excited', 'serene', 'curious', 'joyful', 'peaceful', 'inspired', 'terrified'];
  seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'Monsoon', 'Cherry Blossom', 'Maple Season'];
  destinations = [
    'Kinkaku-ji',
    'Hakuba Valley',
    'Himeji Castle',
    'Hokkaido',
    'Kyoto',
    'Mt. Fuji',
    'Nara',
    'Okinawa',
    'Shirakawa-go',
    'Tokyo',
    'Yokohama',
    'Yonaha Maehama Beach',
  ];
  activities = [
    'Cookout', 'Festival', 'Hiking', 'Cultural Tour', 'Skiing', 'Hot Spring Soak', 'Boat Ride'
  ];
  groupSizes = ['Solo', 'Small Group (2-5)', 'Family (6-10)', 'Large Group (10+)'];
  timesOfDay = ['Morning', 'Afternoon', 'Evening', 'Night'];

  params = {
    destination: this.destinations[0],
    tone: this.tones[0],
    mood: this.moods[0],
    season: this.seasons[0],
    activity: this.activities[0],
    groupSize: this.groupSizes[0],
    timeOfDay: this.timesOfDay[0],
  }; // Default params

  aiProviders = ['OpenAI', 'Grok'];
  disabled = computed(() => !this.auth.isAuthenticated())

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.snackBar.dismiss())
  }

  generateContent(promptForm: NgForm) {
    promptForm.form.disable();
    this.error.set(null);
    this.busy.set(true);
    this.snackBar.open('Generating your event content with AI. Please wait a moment while we craft something special for you!', 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'success-bar'
    });

    this.aiService.generateContent$(this.params, this.customText || 'happy', this.aiProvider).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (aiEvent) => {
        this.eventCreated.emit(aiEvent);
        promptForm.form.enable();
      },
      error: (e) => {
        this.error.set(e.message);
        this.busy.set(false);
        promptForm.form.enable();
      },
      complete: () => this.busy.set(false)
    });
  }
}
