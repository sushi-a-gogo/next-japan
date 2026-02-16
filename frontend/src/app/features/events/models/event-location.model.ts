export interface EventLocation {
  locationId: string;
  locationName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  displayAddress?: string;
  longitude?: number;
  latitude?: number;
  locationNotes?: string;
  mapsUrl?: string;
}
