import { IVowel, VowelLat, VowelLon } from "./sounds.model";

export const VOWELS: IVowel[] = [
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
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Central,
    key: 'ɨ'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Central,
    key: 'ʉ',
    rounded: true
  },


  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Front,
    key: 'ɪ'
  },
  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Front,
    key: 'ʏ',
    rounded: true
  },


  
  {
    openness: VowelLon.NearOpen,
    frontness: VowelLat.Front,
    key: 'æ'
  },
  {
    openness: VowelLon.NearOpen,
    frontness: VowelLat.Central,
    key: 'ɐ'
  },

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
    openness: VowelLon.Open,
    frontness: VowelLat.Back,
    key: 'ɑ'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Back,
    key: 'ɒ'
  },

]
