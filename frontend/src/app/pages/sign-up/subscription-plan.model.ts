export interface SubscriptionPlan {
  name: string;
  code: string;
  description: string;
  benefits: string[];
  price: { individual: number, family: number }
}

export const plans: SubscriptionPlan[] = [
  {
    name: 'Wanderer',
    code: 'pink',
    description: "Perfect for casual explorers seeking a taste of Japan's highlights.",
    benefits: [
      'Enjoy up to 4 unforgettable events each year',
      'Friendly support via text—always here when you need us',
      'Flexible cancellations: change plans up to one week before your event'
    ],
    price: {
      individual: 99,
      family: 199
    }
  },
  {
    name: 'Explorer',
    code: 'green',
    description: 'Ideal for travelers eager to dive deeper into local culture and experiences.',
    benefits: [
      'Access up to 8 exclusive events each year',
      'Priority booking for popular experiences',
      'Friendly support via text and phone—get help anytime',
      'Flexible cancellations: change plans up to 3 days before your event',
      'Receive a welcome gift with your first booking'
    ],
    price: {
      individual: 299,
      family: 499
    }
  },
  {
    name: 'Trailblazer',
    code: 'blue',
    description: 'For adventurous souls ready to discover hidden gems and unique adventures.',
    benefits: [
      'Unlimited access to all exclusive events throughout the year',
      'First-choice booking for every experience—never miss out',
      'Dedicated concierge support 24/7 via text, phone, or video',
      'Flexible cancellations: change plans up to 24 hours before your event',
      'Receive premium welcome gifts and exclusive member-only offers',
      'Invitation to VIP-only events and behind-the-scenes experiences'
    ],
    price: {
      individual: 999,
      family: 1499
    }
  },
  {
    name: 'Summiteer',
    code: 'brown',
    description: 'Designed for thrill seekers craving the most exclusive and daring experiences.',
    benefits: [
      'Unrestricted VIP access to every elite event—no limits, all year',
      'Priority #1 booking—guaranteed spots at the most exclusive experiences',
      'Personal concierge support 24/7 via text, phone, or video—your wish is our command',
      'Ultimate flexibility: cancel or change plans up to 12 hours before your event',
      'Receive luxury welcome gifts and ultra-exclusive member-only offers',
      'Exclusive invitation-only VIP galas, private tours, and once-in-a-lifetime adventures'
    ],
    price: {
      individual: 2000,
      family: 4000
    }
  },
];
