import { Injectable } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  backgroundImageUrl(imageId: string) {
    return `url('${environment.apiUrl}/images/${imageId}')`;
  }

  resizeImage(image: AppImageData, width: number, height: number) {
    if (image.cloudfareImageId) {
      return this.resizeCloudfareImage(image, width, height);
    }

    const resizedImage = {
      ...image,
      width,
      height
    };

    return { image: resizedImage, src: `${environment.apiUrl}/api/image/resize/${width}/${height}/${image.id}` }
  }

  resizeCloudfareImage(image: AppImageData, width: number, height: number) {
    const resizedImage = {
      ...image,
      width,
      height
    };
    const src = `${environment.cloudfareUrl}/${environment.cloudfareAccountHash}/${image.cloudfareImageId}` +
      `/public?w=${width}&h=${height}&format=webp&quality=100`

    return { image: resizedImage, src }

  }
}
