import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FooterComponent } from '@app/footer/footer.component';
import { OpenAiService } from '@app/services/open-ai.service';
import { ContentGeneratorComponent } from "./components/content-generator/content-generator.component";
import { DottedBgComponent } from "./components/dotted-bg/dotted-bg.component";

@Component({
  selector: 'app-dream',
  imports: [DottedBgComponent, ContentGeneratorComponent, FooterComponent],
  templateUrl: './dream.component.html',
  styleUrl: './dream.component.scss'
})
export class DreamComponent implements OnInit {
  private openAi = inject(OpenAiService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const prompt = 'A cartoon snowman wearing sunglasses on a beach';
    // this.openAi.generateImage(prompt).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
    //   console.log(res);
    // })
  }
}
