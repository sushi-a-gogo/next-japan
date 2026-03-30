import { HttpClient } from '@angular/common/http';
import { Component, output, signal } from '@angular/core';
import { DialogComponent } from '@app/shared/ui/dialog/dialog.component';
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-my-resume',
  imports: [MarkdownModule, DialogComponent, NextButtonComponent],
  templateUrl: './my-resume.component.html',
  styleUrl: './my-resume.component.scss'
})
export class MyResumeComponent {
  resumeContent = signal<string>('');
  close = output<boolean>();

  constructor(private http: HttpClient) {
    this.http.get('/assets/resume.md', { responseType: 'text' })
      .subscribe({
        next: (data) => this.resumeContent.set(data),
        error: (err) => console.error('Error loading resume:', err),
      });
  }

  closeResume() {
    this.close.emit(true);
  }
}
