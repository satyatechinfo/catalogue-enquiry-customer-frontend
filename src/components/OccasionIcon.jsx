import Icon from './Icon.jsx';

const ICONS = {
  diwali: 'lamp',
  'new-year': 'sparkle',
  'employee-onboarding': 'userPlus',
  'work-anniversary': 'award',
  'client-appreciation': 'heart',
  'events-conferences': 'mic',
};

export default function OccasionIcon({ slug, size = 28 }) {
  return <Icon name={ICONS[slug] || 'gift'} size={size} />;
}
