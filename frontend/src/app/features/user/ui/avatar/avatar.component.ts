import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Avatar } from '@app/core/models/avatar.model';
import { ImageService } from '@app/core/services/image.service';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  private imageService = inject(ImageService);

  avatar = input.required<Avatar>();
  size = input<number>(33);
  altText = input<string>('A user avatar');

  resizedImage = computed(() => {
    const imageSize = this.size() * 2;// Math.max(this.size, this.MIN_IMAGE_SIZE);
    return this.imageService.resizeImage(this.avatar().image, imageSize, imageSize);
  });

  styleCss = computed(() => ({
    width: `${this.size()}px`,
    height: `${this.size()}px`,
  }));
}
