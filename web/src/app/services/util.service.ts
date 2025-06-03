import { Injectable } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  getEventDisplayAddress(location: MapLocation) {
    const address: string[] = [];
    if (!!location.addressLine1) {
      address.push(location.addressLine1);
    }
    if (!!location.addressLine2) {
      address.push(location.addressLine2);
    }

    const cityStateZip: string[] = [];
    if (!!location.city) {
      cityStateZip.push(location.city);
    }
    if (!!location.state) {
      cityStateZip.push(location.state);
    }
    if (!!location.zip) {
      cityStateZip.push(location.zip);
    }

    if (address.length || cityStateZip.length) {
      if (address.length && cityStateZip.length) {
        return `${address.join(' ')}, ${cityStateZip.join(' ')}`;
      } else {
        return `${[...address, ...cityStateZip].join(' ')}`;
      }
    }

    return undefined;
  }
}
