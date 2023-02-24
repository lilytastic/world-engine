import { IVowel, VowelLat, VowelLon } from "../models/sounds.model";

export const VOWELS: IVowel[] = [
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    phoneme: 'i'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    phoneme: 'y'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Central,
    phoneme: 'ɨ'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Central,
    phoneme: 'ʉ',
    rounded: true
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Back,
    phoneme: 'ɯ'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Back,
    phoneme: 'u',
    rounded: true
  },


  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Front,
    phoneme: 'ɪ'
  },
  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Front,
    phoneme: 'ʏ',
    rounded: true
  },
  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Back,
    phoneme: 'ʊ',
    rounded: true
  },


  {
    openness: VowelLon.Mid,
    frontness: VowelLat.Central,
    phoneme: 'ə'
  },

  
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Front,
    phoneme: 'e'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Front,
    phoneme: 'ø',
    rounded: true
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Central,
    phoneme: 'ɘ'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Central,
    phoneme: 'ɵ',
    rounded: true
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Back,
    phoneme: 'ɤ'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Back,
    phoneme: 'o',
    rounded: true
  },


  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Front,
    phoneme: 'ɛ'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Front,
    phoneme: 'œ',
    rounded: true
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Central,
    phoneme: 'ɜ'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Central,
    phoneme: 'ɞ',
    rounded: true
  },

  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Back,
    phoneme: 'ʌ'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Back,
    phoneme: 'ɔ',
    rounded: true
  },



  {
    openness: VowelLon.NearOpen,
    frontness: VowelLat.Front,
    phoneme: 'æ',
    romanization: 'ae'
  },
  {
    openness: VowelLon.NearOpen,
    frontness: VowelLat.Central,
    phoneme: 'ɐ'
  },

  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    phoneme: 'a'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    phoneme: 'ɶ',
    rounded: true
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Central,
    phoneme: 'ä'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Back,
    phoneme: 'ɑ'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Back,
    phoneme: 'ɒ'
  },

].map(x => ({...x, type: 'vowel'}));
