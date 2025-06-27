import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { DialogService } from '@app/services/dialog.service';
import { ImageService } from '@app/services/image.service';
import { PageLoadSpinnerComponent } from "@shared/page-load-spinner/page-load-spinner.component";

@Component({
  selector: 'app-spin-up',
  imports: [NgOptimizedImage, PageLoadSpinnerComponent],
  templateUrl: './spin-up.component.html',
  styleUrl: './spin-up.component.scss'
})
export class SpinUpComponent implements OnInit {
  private dialogService = inject(DialogService)
  private imageService = inject(ImageService);
  private spinUpImage: AppImageData = {
    id: "about.png",
    cloudfareImageId: "32d6e94b-c33d-4953-379c-fe2a1b373400",
    width: 1366,
    height: 768
  };

  image = computed(() => {
    return this.imageService.resizeImage(this.spinUpImage, this.spinUpImage.width, this.spinUpImage.height);
  });

  visible = signal(false);

  ngOnInit(): void {
    setTimeout(() => {
      this.visible.set(true);
      this.dialogService.showAboutDialog();
    }, 250);
  }

}
