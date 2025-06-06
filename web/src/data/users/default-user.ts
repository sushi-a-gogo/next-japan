import { UserProfile } from "@models/user-profile.model";

export const DUMMY_USERS: UserProfile[] = [
  {
    userId: 1,
    addressLine1: '99 Ranch Rd',
    imageId: 'avatars/mister.png',
    city: 'Lazytown',
    email: 'riuchi.takayama@studio-gh.mov',
    firstName: 'Riuchi',
    isEmailPreferred: false,
    lastName: 'Takayama',
    phone: '+15552223333',
    state: 'TX',
    zip: '78723',
  },
  {
    userId: 2,
    addressLine1: '99 Ranch Rd',
    imageId: 'avatars/miss.png',
    city: 'Lazytown',
    email: 'kiki.takayama@studio-gh.mov',
    firstName: 'Kikituyima',
    isEmailPreferred: false,
    lastName: 'Takayama',
    phone: '+15552223333',
    state: 'TX',
    zip: '78723',
  }

];

