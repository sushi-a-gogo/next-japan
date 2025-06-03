export interface MapLocation {
  locationId: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  longitude?: number;
  latitude?: number;
  notes?: string;
}
