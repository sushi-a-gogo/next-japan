import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, Input } from '@angular/core';
import { ImageService } from '@app/services/image.service';
import { Avatar } from 'src/app/models/avatar.model';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  private imageService = inject(ImageService);

  avatar = input.required<Avatar>();
  @Input() size: number = 33;
  @Input() altText = 'Avatar';

  resizedImage = computed(() => {
    const imageSize = this.size * 2;// Math.max(this.size, this.MIN_IMAGE_SIZE);
    return this.imageService.resizeImage(this.avatar().image, imageSize, imageSize);
  });

  styleCss = computed(() => ({
    width: `${this.size}px`,
    height: `${this.size}px`,
  }));
}
