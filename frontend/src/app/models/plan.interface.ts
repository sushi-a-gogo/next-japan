export interface Plan {
  name: string;
  title: string;
  description: string;
  benefits: string[];
  price: number;
  imageUrl: string;
  icon: string;
  mostPopular?: boolean;
  subscribed?: boolean;
  selected?: boolean
}

const SUBSCRIPTION_PLANS: Plan[] = [
  {
    name: 'Basic',
    title: 'BASIC PLAN',
    description: 'Get started with limited access',
    benefits: [
      'Browse public events',
      'Access community forums',
      'View event photo galleries'
    ],
    price: 150,
    imageUrl: '/assets/plans/free.jpg', // Replace with your image paths
    icon: '🌱',
    mostPopular: false
  },
  {
    name: 'Solo',
    title: 'SOLO PLAN',
    description: 'Perfect for casual travelers',
    benefits: [
      'Register for standard events',
      'Use AI event builder (limited)',
      'Receive event reminders'
    ],
    price: 800,
    imageUrl: '/assets/plans/solo.jpg',
    icon: '👤',
    mostPopular: false
  },
  {
    name: 'Family',
    title: 'FAMILY',
    description: 'Bring everyone on the journey',
    benefits: [
      'Register up to 4 members',
      'Group itinerary planning',
      'Priority booking for family-friendly events'
    ],
    price: 1500,
    imageUrl: '/assets/plans/family.jpg',
    icon: '🏯',
    mostPopular: true
  },
  {
    name: 'Pro',
    title: 'PREMIUM',
    description: 'For elite travelers and power users',
    benefits: [
      'Access to all events',
      'AI-powered itinerary builder',
      'VIP-only locations',
      'Priority access & support'
    ],
    price: 2400,
    imageUrl: '/assets/plans/pro.jpg',
    icon: '🗼',
    mostPopular: false
  }
];

export default SUBSCRIPTION_PLANS;
