
export enum ProbabilityType {
  FastDropoff,
  MediumDropoff,
  Equiprobable
}

export function getRandomArrayItem<T>(arr: T[], probabilityType?: ProbabilityType) {
  let range = arr.length;
  let probability = Math.random() * 1.0;
  switch (probabilityType) {
    case ProbabilityType.FastDropoff:
      range = arr.length * probability;
      break;
    case ProbabilityType.MediumDropoff:
      range = arr.length * (probability * 1.5);
      break;
    default:
      break;
  }
  return arr[Math.floor(Math.random() * range)];
}