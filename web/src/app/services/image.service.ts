import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() { }

  imageIdSrc(imageId: string) {
    return `assets/images/${imageId}`;
  }

  backgroundImage(imageId: string) {
    return `url(${this.imageIdSrc(imageId)})`;
  }
}
