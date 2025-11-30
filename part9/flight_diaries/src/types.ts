import { z } from 'zod';
import { newEntrySchema } from './utils';

export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Windy = "windy",
  Stormy = "stormy",
}
export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string | undefined;
};

export type NewDiaryEntry = z.infer<typeof newEntrySchema>;

