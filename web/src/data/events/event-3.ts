import { EventCoordinator } from '@app/event/models/event-coordinator.model';
import { EventInformation } from '@app/event/models/event-information.model';
import { EventLocation } from '@app/event/models/event-location.model';
import { organization } from '../organization-data';

const eventId = 3;

const org = {
  organizationId: organization.organizationId,
  clientId: organization.clientId,
  organizationName: organization.name,
  logoImageId: organization.logoImageId,
  clientName: organization.clientName,
};

const tz = {
  timeZone: 'Asia/Tokyo',
  timeZoneAbbreviation: 'JST',
  timeZoneOffset: 9,
};

const title = 'Campfire Cookout';
const description =
  'Enjoy a night of fun and food with friends and family on the sandy dunes of beautiful Kikugahama Beach! We will have a bonfire, games, and more.';
const fullDescription = `
Join us for an unforgettable evening at the annual Campfire Cookout on the stunning sands of Kikugahama Beach! This event is perfect for families, friends, and anyone looking to enjoy the great outdoors in a fun and welcoming atmosphere.

As the sun sets over the Sea of Japan, gather around a roaring bonfire and savor delicious campfire-cooked meals, including freshly grilled seafood, local vegetables, and classic s'mores. Our team will provide all the necessary equipment and ingredients, so all you need to bring is your enthusiasm and appetite!

Throughout the night, enjoy a variety of beach games and activities suitable for all ages, such as beach volleyball, sandcastle building contests, and scavenger hunts. There will also be live acoustic music performances by local artists, creating the perfect backdrop for a relaxing and memorable evening.

For those interested in learning new skills, we will host interactive workshops on outdoor cooking techniques, fire safety, and sustainable beach practices. Our friendly event coordinators will be on hand to ensure everyone has a safe and enjoyable experience.

Space is limited to maintain a cozy and intimate setting, so be sure to sign up early. Don’t miss this chance to connect with your community, make new friends, and create lasting memories under the stars at Kikugahama Beach!

Event Highlights:
- Bonfire and campfire-cooked dinner
- Beach games and contests
- Live music performances
- Outdoor cooking and safety workshops
- Family-friendly activities
- Beautiful seaside location

What to Bring:
- Comfortable beachwear and a light jacket
- Reusable water bottle
- Blanket or beach chair (optional)

We look forward to seeing you at the Campfire Cookout!

For questions or special accommodations, please contact our event coordinators.
`;
const imageId = 'events/campfire.png';

const eventCoordinators: EventCoordinator[] = [
  {
    eventId,
    firstName: 'Poyi',
    lastName: 'Joiri',
    email: 'xx@yy.zz',
    imageId: 'avatars/avatar-3.jpg'

  },
  {
    eventId,
    firstName: 'Mya',
    lastName: 'Ashford',
    email: 'xx@yy.zz',
    imageId: 'avatars/avatar-1.jpg'

  },
  {
    eventId,
    firstName: 'Tlu',
    lastName: 'Marks',
    email: 'xx@yy.zz',
    imageId: 'avatars/avatar-2.jpg'

  },
];

const locations: EventLocation[] = [
  {
    eventId,
    locationId: 5,
    name: 'Kikugahama Beach',
    addressLine1: 'Historical Landmark',
    city: 'Hagi',
    state: 'Japan',
    zip: '758-0057',
    latitude: 34.417891070193804,
    longitude: 131.3878227526694,
  },
];

export const eventInformation3: EventInformation = {
  eventId,
  eventTitle: title,
  description,
  fullDescription,
  eventCoordinators,
  locations,
  imageId,
  ...tz
};
