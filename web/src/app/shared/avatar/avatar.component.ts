import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AppImageData } from 'src/app/models/app-image-data.model';
import { Avatar } from 'src/app/models/avatar.model';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent implements OnInit {
  @Input() avatar?: Avatar;
  @Input() avatarImageData?: AppImageData;
  @Input() size: number = 33;
  @Input() altText = 'Avatar';
  imageIdSrc: string | null = null;
  defaultAvatarImage = 'assets/images/head.png';
  styleCss: any;

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.styleCss = {
      width: `${this.size}px`,
      height: `${this.size}px`,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const changeAvatar = changes['avatar'];
    if (changeAvatar) {
      this.imageIdSrc = this.avatar?.imageId ? `${this.imageService.imageIdSrc(this.avatar.imageId)}` : null;
    }
  }

}
