export type Track = {
  n: string;
  title: string;
  artist: string;
  duration: string;
};

export type Side = {
  label: string;
  subtitle: string;
  tracks: Track[];
};

// TODO: replace with real playlist
export const playlist: Side[] = [
  {
    label: "Side A · what I'm on this month",
    subtitle: 'April 2026',
    tracks: [
      { n: 'A1', title: 'Track one', artist: 'Artist', duration: '0:00' },
      { n: 'A2', title: 'Track two', artist: 'Artist', duration: '0:00' },
      { n: 'A3', title: 'Track three', artist: 'Artist', duration: '0:00' },
      { n: 'A4', title: 'Track four', artist: 'Artist', duration: '0:00' },
    ],
  },
  {
    label: 'Side B · for shipping',
    subtitle: 'loud on purpose',
    tracks: [
      { n: 'B1', title: 'Track one', artist: 'Artist', duration: '0:00' },
      { n: 'B2', title: 'Track two', artist: 'Artist', duration: '0:00' },
      { n: 'B3', title: 'Track three', artist: 'Artist', duration: '0:00' },
      { n: 'B4', title: 'Track four', artist: 'Artist', duration: '0:00' },
    ],
  },
];
