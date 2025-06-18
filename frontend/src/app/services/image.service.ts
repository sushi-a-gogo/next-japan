import { Injectable } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  backgroundImageUrl(imageId: string) {
    return `url('${environment.apiUri}/images/${imageId}')`;
  }

  resizeImage(image: AppImageData, width: number, height: number) {
    const resizedImage = {
      ...image,
      width,
      height
    };

    return { image: resizedImage, src: `${environment.apiUri}/api/image/resize/${width}/${height}/${image.id}` }

  }
}
