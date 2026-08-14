export interface Track {
  id: string;
  youtubeId: string;
  title: string;
  movie: string;
  artist: string;
  duration: string;
  tag: string;
  year?: string;
}

export type TimeOfDay = 'bhor' | 'dopahar' | 'shaam' | 'raat';

export interface BusCorporation {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  busNumber: string;
  defaultRoute: {
    from: string;
    to: string;
    via: string;
  };
  slogans: string[];
}

export interface NostalgicQuote {
  id: number;
  hindi: string;
  english: string;
  tag: string;
  author: string;
}

export interface BusTicket {
  ticketNumber: string;
  from: string;
  to: string;
  passengerName: string;
  seatNumber: string;
  fare: number;
  date: string;
  time: string;
  busService: string;
  isPunched: boolean;
}

export interface DhabaItem {
  id: string;
  name: string;
  hindiName: string;
  desc: string;
  price: string;
  icon: string;
  soundType?: string;
}
