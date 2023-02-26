import { CONSONANTS } from "../data/consonants";
import { VOWELS } from "../data/vowels";
import { ILanguage, IPhonologicalToken, ISound, PhonologicalTokenCollectionTypes, TypedSound } from "../models/sounds.model";


export function getSoundByPhoneme(phoneme: string): TypedSound | null {
  let sounds: TypedSound[] = [...VOWELS, ...CONSONANTS];
  return sounds.find(x => x.phoneme === phoneme) || null;
}

function getRandomSound(sounds: ISound[]) {
  return sounds[Math.floor(Math.random() * sounds.length)];
}

export function getSound(language: ILanguage, phoneme: string) {
  let sounds = [...language.vowels, ...language.consonants];
  return sounds.find(x => x.phoneme === phoneme);
}

export function getSounds(language: ILanguage, token: IPhonologicalToken, tokenItem: string) {
  let sounds = [...language.vowels, ...language.consonants];
  switch (token.type) {
    case PhonologicalTokenCollectionTypes.Phonetic:
      return sounds.filter(sound => sound.phoneme === tokenItem);
    case PhonologicalTokenCollectionTypes.Terms:
      return sounds.filter(sound => doesSoundMatchToken(sound, tokenItem));
    default:
      return [];
  }
}

export function doesSoundMatchToken(sound: TypedSound, token: string) {
  switch (token) {
    case 'V':
      return sound.type === 'vowel';
    case 'C':
      return sound.type === 'consonant';
    default:
      break;
  }
  switch (token.toLowerCase()) {
    case 'voiced':
      return sound.voiced;
    case 'unvoiced':
      return !sound.voiced;
    case 'rounded':
      if (sound.type === "vowel") {
        return sound.rounded;
      }
      break;
    case 'vowels':
      if (sound.type === "vowel") {
        return true;
      } else {
        return false;
      }
      break;
    case 'consonants':
      if (sound.type === "consonant") {
        return true;
      } else {
        return false;
      }
      break;
    case 'fricatives':
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase().includes('fricative');
      } else {
        return false;
      }
    case 'affricates':
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase().includes('affricate');
      } else {
        return false;
      }
    default:
      if (sound.type === "vowel") {
        return sound.openness.toLowerCase() === token.toLowerCase() || sound.frontness.toLowerCase() === token.toLowerCase()
      }
      if (sound.type === "consonant") {
        return sound.manner.toLowerCase() === token.toLowerCase().slice(0, -1) || sound.place.toLowerCase() === token.toLowerCase().slice(0, -1);
      }
      break;
  }
  return false;
}

export const getAffectedSounds = (language: ILanguage, tokens: IPhonologicalToken[]): {permitted: TypedSound[], forbidden: TypedSound[]} => {
  let sounds: TypedSound[] = [...language.vowels, ...language.consonants];
  let permitted: TypedSound[] = [];
  let forbidden: TypedSound[] = [];
  let allowAutoOpen = true;

  let _sounds: TypedSound[] = [];

  for (let ci = 0; ci < tokens.length; ci++) {
    const token = tokens[ci];
    const nextToken = tokens[ci + 1];
    let operativeToken = token;

    if (token.type === '-') {
      // If you're just removing sounds, assume it's removing from the full set.
      if (nextToken?.items.length > 0) {
        _sounds = nextToken.items.map(item => getSounds(language, nextToken, item)).flat();
        forbidden = [...forbidden, ..._sounds];
      }
      ci++;
    } else if (token.type === '+' || token.type.includes('collection')) {
      allowAutoOpen = false;
      const collectionToken = token.type === '+' ? nextToken : token;
      if (collectionToken.items.length > 0) {
        _sounds = collectionToken.items.map(item => getSounds(language, collectionToken, item)).flat();
        permitted = [...permitted, ..._sounds];
      }
      if (token.type === '+') {
        ci++;
      }
    } 
  }

  return {permitted, forbidden};
}

