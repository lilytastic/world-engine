import { IVowel, VowelLat, VowelLon } from "../models/sounds.model";

export const VOWELS: IVowel[] = [
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    phoneme: 'i',
    audio: 'Close_front_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Front,
    phoneme: 'y',
    audio: 'Close_front_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Central,
    phoneme: 'ɨ',
    audio: 'Close_central_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Central,
    phoneme: 'ʉ',
    rounded: true,
    audio: 'Close_central_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Back,
    phoneme: 'ɯ',
    audio: 'Close_back_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Close,
    frontness: VowelLat.Back,
    phoneme: 'u',
    rounded: true,
    audio: 'Close_back_rounded_vowel.ogg.mp3'
  },


  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Front,
    phoneme: 'ɪ',
    audio: 'Near-close_near-front_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Front,
    phoneme: 'ʏ',
    romanization: 'ü',
    rounded: true,
    audio: 'Near-close_near-front_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.NearClose,
    frontness: VowelLat.Back,
    phoneme: 'ʊ',
    rounded: true,
    audio: 'Near-close_near-back_rounded_vowel.ogg.mp3'
  },


  {
    openness: VowelLon.Mid,
    frontness: VowelLat.Central,
    phoneme: 'ə',
    audio: 'Mid-central_vowel.ogg.mp3'
  },

  
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Front,
    phoneme: 'e',
    audio: 'Close-mid_front_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Front,
    phoneme: 'ø',
    rounded: true,
    audio: 'Close-mid_front_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Central,
    phoneme: 'ɘ',
    audio: 'Close-mid_central_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Central,
    phoneme: 'ɵ',
    rounded: true,
    audio: 'Close-mid_central_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Back,
    phoneme: 'ɤ',
    audio: 'Close-mid_back_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.CloseMid,
    frontness: VowelLat.Back,
    phoneme: 'o',
    rounded: true,
    audio: 'Close-mid_back_rounded_vowel.ogg.mp3'
  },


  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Front,
    phoneme: 'ɛ',
    audio: 'Open-mid_front_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Front,
    phoneme: 'œ',
    rounded: true,
    audio: 'Open-mid_front_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Central,
    phoneme: 'ɜ',
    audio: 'Open-mid_central_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Central,
    phoneme: 'ɞ',
    rounded: true,
    audio: 'Open-mid_central_rounded_vowel.ogg.mp3'
  },

  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Back,
    phoneme: 'ʌ',
    audio: 'PR-open-mid_back_unrounded_vowel2.ogg.mp3'
  },
  {
    openness: VowelLon.OpenMid,
    frontness: VowelLat.Back,
    phoneme: 'ɔ',
    rounded: true,
    audio: 'PR-open-mid_back_rounded_vowel.ogg.mp3'
  },



  {
    openness: VowelLon.NearOpen,
    frontness: VowelLat.Front,
    phoneme: 'æ',
    romanization: 'ae',
    audio: 'Near-open_front_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.NearOpen,
    frontness: VowelLat.Central,
    phoneme: 'ɐ',
    audio: 'Near-open_central_unrounded_vowel.ogg.mp3'
  },

  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    phoneme: 'a',
    audio: 'PR-open_front_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    phoneme: 'a:',
    romanization: 'aa',
    long: true,
    audio: 'Open_central_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Front,
    phoneme: 'ɶ',
    rounded: true,
    audio: 'Open_front_rounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Central,
    phoneme: 'ä',
    audio: 'Open_central_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Back,
    phoneme: 'ɑ',
    audio: 'Open_back_unrounded_vowel.ogg.mp3'
  },
  {
    openness: VowelLon.Open,
    frontness: VowelLat.Back,
    phoneme: 'ɒ',
    audio: 'Open_back_rounded_vowel.ogg.mp3'
  },

].map(x => ({...x, type: 'vowel'}));
