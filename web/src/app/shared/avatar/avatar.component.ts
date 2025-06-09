import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Avatar } from 'src/app/models/avatar.model';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent implements OnInit {
  avatar = input.required<Avatar>();
  @Input() size: number = 33;
  @Input() altText = 'Avatar';
  imageIdSrc = computed(() => `${environment.apiUri}/images/${this.avatar().image.id}`);
  defaultAvatarImage = 'assets/images/head.png';
  styleCss: any;

  ngOnInit(): void {
    this.styleCss = {
      width: `${this.size}px`,
      height: `${this.size}px`,
    };
  }
}
