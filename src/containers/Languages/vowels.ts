import { IVowel, VowelLat, VowelLon } from "./sounds.model";

export const VOWELS: IVowel[] = [
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    key: 'a'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    key: 'ɶ',
    rounded: true
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Central,
    key: 'ä'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    key: 'i'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    key: 'y'
  },
]
