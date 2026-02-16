import { Injectable } from '@angular/core';
import { AppImageData } from '@app/core/models/app-image-data.model';
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
    if (image.cloudflareImageId) {
      return this.resizeCloudflareImage(image, width, height);
    }

    const resizedImage = {
      ...image,
      width,
      height
    };

    return { image: resizedImage, src: `${environment.apiUrl}/api/image/resize/${width}/${height}/${image.id}` }
  }

  resizeCloudflareImage(image: AppImageData, width: number, height: number) {
    const resizedImage = {
      ...image,
      width,
      height
    };
    const src = `${environment.cloudfareUrl}/${environment.cloudfareAccountHash}/${image.cloudflareImageId}` +
      `/public?w=${width}&h=${height}&format=auto&quality=85`

    return { image: resizedImage, src }

  }
}
