import { EventCoordinator } from '@app/event/models/event-coordinator.model';
import { EventInformation } from '@app/event/models/event-information.model';
import { EventLocation } from '@app/event/models/event-location.model';
import { timeZone } from '../timeZone';

const eventId = 1;
const tz = timeZone;

const title = 'Mount Fuji Retreat';
const description =
  'Explore the beauty of Mount Fuji and enjoy an evening of fun and food with friends and family! We will have a bonfire, games, and more.';
const fullDescription =
  `Join us for a special event at the base of Mount Fuji! Experience the breathtaking scenery of Japan's most iconic mountain while connecting with friends, family, and fellow adventurers.

The event begins with a warm welcome and refreshments featuring local specialties. Settle in and enjoy the stunning views of Mount Fuji as you prepare for a day filled with fun and engaging activities.

Start the morning with an optional group yoga session overlooking the mountain, followed by a guided nature walk through nearby scenic trails. Our expert guides will share fascinating insights into the region's unique flora, fauna, and geological history.

After the walk, participate in hands-on workshops such as Japanese calligraphy, origami, or a cooking demonstration where you'll learn to prepare authentic dishes using fresh, local ingredients. For those seeking adventure, try mountain biking or canoeing on a nearby lake.

As the event draws to a close, gather around a cozy bonfire for storytelling, live acoustic music, and marshmallow roasting. Enjoy a delicious meal featuring a rotating menu of Japanese and international cuisine, with vegetarian and vegan options available.

Whether you're looking to relax in nature, make new friends, or try something new, this Mount Fuji event offers something for everyone. Our friendly staff and experienced coordinators are dedicated to making your experience safe, enjoyable, and memorable.

Space is limited, so sign up today to reserve your spot at this unique Mount Fuji gathering! Don't miss this opportunity to create lasting memories in one of Japan's most beautiful and culturally rich locations.`;

const imageId = 'fuji.png';

const eventCoordinators: EventCoordinator[] = [
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
    locationId: 1,
    name: 'Mt.Fuji Camp & Glamp',
    addressLine1: '2533-1 Oishi',
    city: 'Yamanashi',
    state: 'Japan',
    zip: '401-0305',
    latitude: 35.53679643728625,
    longitude: 138.74085199321922,
  },
  {
    eventId,
    locationId: 2,
    name: 'Fujimibashi Mount Fuji Viewing Platform',
    addressLine1: 'Minamitsuru District',
    city: 'Kawaguchi',
    state: 'Japan',
    zip: '401-0304',
    latitude: 35.541875726481244,
    longitude: 138.76978589528957,
  },
];

export const eventInformation1: EventInformation = {
  eventId,
  eventTitle: title,
  description,
  fullDescription,
  eventCoordinators,
  locations,
  imageId,
  imagePos: 'top',
  ...tz,
};
