import { AppImageData } from "./app-image-data.model";

export interface OrganizationInformation {
  name: string;
  image: AppImageData;
  bannerTitle: string;
  bannerSubTitle: string;
  bannerDescription: string;
  infoTitle: string;
  infoDescription: string;
  supportEmail?: string;
}
