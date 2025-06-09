import { EventCoordinator } from '@app/event/models/event-coordinator.model';
import { EventInformation } from '@app/event/models/event-information.model';
import { EventLocation } from '@app/event/models/event-location.model';
import { timeZone } from '../timeZone';

const eventId = 2;
const tz = timeZone;

const title = 'Explore Kinkaku-ji';
const description =
  'Discover the beauty of Kinkaku-ji, the Golden Pavilion, and enjoy a day of fun and food with friends and family! We will have a bonfire, games, and more.';
const fullDescription =
  `Discover the beauty of Kinkaku-ji, the Golden Pavilion, and enjoy a day of fun and food with friends and family!

Join us for an immersive experience at one of Japan’s most iconic landmarks. The day begins with a guided tour of Kinkaku-ji, where you’ll learn about its rich history, stunning architecture, and the legends surrounding this UNESCO World Heritage Site. Marvel at the shimmering gold leaf exterior reflecting in the tranquil pond, and stroll through the beautifully landscaped gardens filled with seasonal flowers and ancient trees.

After the tour, participate in a traditional Japanese tea ceremony in a nearby teahouse, where you can savor matcha and local sweets while enjoying views of the pavilion. For those interested in culture, we offer hands-on workshops in calligraphy and origami, as well as a kimono dress-up experience with photo opportunities.

Lunch will feature a variety of Japanese dishes, including vegetarian and vegan options, served picnic-style in the gardens. In the afternoon, join group games and scavenger hunts designed for all ages, or relax by the South Pond and take in the peaceful scenery.

As evening approaches, gather around a bonfire for storytelling, live music, and marshmallow roasting. Our event coordinators will share fascinating tales about Kyoto’s history and the significance of Kinkaku-ji. The day concludes with a lantern release, symbolizing good wishes and new friendships.

All activities are family-friendly and suitable for both locals and visitors. Don’t miss this unique opportunity to connect with others, learn about Japanese culture, and create lasting memories at the Golden Pavilion!`;

const image = {
  id: 'golden.png',
  height: 1024,
  width: 1536

};


const eventCoordinators: EventCoordinator[] = [
  {
    eventId,
    firstName: 'Poyi',
    lastName: 'Joiri',
    email: 'xx@yy.zz',
    image: {
      id: "avatars/avatar-3.jpg",
      width: 255,
      height: 255
    }
  },
  {
    eventId,
    firstName: 'Tlu',
    lastName: 'Marks',
    email: 'xx@yy.zz',
    image: {
      id: "avatars/avatar-2.jpg",
      width: 255,
      height: 255
    }
  },
];

const locations: EventLocation[] = [
  {
    eventId,
    locationId: 3,
    name: 'Rokuon-ji Kinkaku (Golden Pavilion)',
    addressLine1: '1 Kinkakujicho, Kita Ward',
    city: 'Kyoto',
    state: 'Japan',
    zip: '603-8361',
    latitude: 35.03962471760949,
    longitude: 135.72843306957876,
  },
  {
    eventId,
    locationId: 4,
    name: 'South Pond Remains',
    addressLine1: '1 Kinkakujicho, Kita Ward',
    city: 'Kyoto',
    state: 'Japan',
    zip: '603-8361',
    latitude: 35.038772637050386,
    longitude: 135.72867446836977,
  },
];

export const eventInformation2: EventInformation = {
  eventId,
  eventTitle: title,
  description,
  fullDescription,
  eventCoordinators,
  locations,
  image,
  ...tz,
};
