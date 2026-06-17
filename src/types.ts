/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RSVP {
  id?: string;
  name: string;
  attending: boolean;
  guestsCount: number;
  drinks: string[];
  dietary: string;
  transport: boolean;
  createdAt: any; // Can be Firebase Timestamp or ISO string
}

export interface Wish {
  id?: string;
  author: string;
  message: string;
  createdAt: any; // Can be Firebase Timestamp or ISO string
  colorKey?: string; // Aesthetic tint for cards (lavender, soft blue, sage, peach)
}

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
  iconName: 'Heart' | 'Camera' | 'MapPin' | 'Music' | 'GlassWater' | 'Sparkles' | 'Clock';
}

export interface LocationItem {
  id: 'zags' | 'stieglitz';
  name: string;
  address: string;
  yandexUrl: string;
  googleUrl: string;
  description: string;
  accentTitle: string; // Style markers
  details: string[];
  image: string;
  coordinates: { lat: number; lng: number };
}
