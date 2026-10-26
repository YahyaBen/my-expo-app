export type SampleDestination = {
  id: string;
  number: number;
  from: string;
  to: string;
  startMinutes: number;
  endMinutes: number;
  transport: 'train' | 'bus';
};

type SampleRoute = Pick<SampleDestination, 'from' | 'to' | 'transport'> & {
  durationMinutes: number;
};

const routes: readonly SampleRoute[] = [
  { from: 'Casablanca', to: 'Rabat', transport: 'train', durationMinutes: 75 },
  { from: 'Rabat', to: 'Tanger', transport: 'train', durationMinutes: 90 },
  { from: 'Marrakech', to: 'Casablanca', transport: 'train', durationMinutes: 180 },
  { from: 'Fès', to: 'Meknès', transport: 'train', durationMinutes: 45 },
  { from: 'Tanger', to: 'Kénitra', transport: 'train', durationMinutes: 80 },
  { from: 'Agadir', to: 'Marrakech', transport: 'bus', durationMinutes: 180 },
  { from: 'Essaouira', to: 'Agadir', transport: 'bus', durationMinutes: 180 },
  { from: 'Tétouan', to: 'Tanger', transport: 'bus', durationMinutes: 75 },
  { from: 'Chefchaouen', to: 'Tétouan', transport: 'bus', durationMinutes: 120 },
  { from: 'Oujda', to: 'Fès', transport: 'bus', durationMinutes: 300 },
];

/** Illustrative journeys for the destination sheet, not live transport schedules. */
export const sampleDestinations: readonly SampleDestination[] = Array.from(
  { length: 100 },
  (_, index) => {
    const route = routes[index % routes.length];
    const startMinutes = 6 * 60 + Math.floor(index / routes.length) * 60 + (index % 3) * 10;

    return {
      id: `destination-${index + 1}`,
      number: index + 1,
      from: route.from,
      to: route.to,
      transport: route.transport,
      startMinutes,
      endMinutes: startMinutes + route.durationMinutes,
    };
  },
);
