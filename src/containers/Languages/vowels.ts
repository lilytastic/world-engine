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
    openness: VowelLon.Close,
    frontness: VowelLat.Back,
    key: 'ɯ'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Back,
    key: 'u',
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
    openness: VowelLon.NearClose,
    frontness: VowelLat.Back,
    key: 'ʊ',
    rounded: true
  },


  {
    openness: VowelLon.Mid,
    frontness: VowelLat.Central,
    key: 'ə'
  },

  
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Front,
    key: 'e'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Front,
    key: 'ø',
    rounded: true
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Central,
    key: 'ɘ'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Central,
    key: 'ɵ',
    rounded: true
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Back,
    key: 'ɤ'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Back,
    key: 'o',
    rounded: true
  },


  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Front,
    key: 'ɛ'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Front,
    key: 'œ',
    rounded: true
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Central,
    key: 'ɜ'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Central,
    key: 'ɞ',
    rounded: true
  },

  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Back,
    key: 'ʌ'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Back,
    key: 'ɔ',
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
