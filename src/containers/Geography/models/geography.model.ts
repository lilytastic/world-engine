export interface IGeography {
  features: IGeographicalFeature[];
  structure: any; // A giant tree structure of all the geographical features. Make a UI to rearrange leaves, add new ones, etc.
}

export enum GeographicalFeatureType {
  Multiverse,
  Universe,
  Galaxy,
  SpaceRegion,
  Celestial, // Nebulas, black holes, etc.
  Star,
  Planet,
  Satellite, // moons, asteroid belts
  Ocean,
  Continent,
  Island,
  Biome, // Desert, tundra, etc.
  Region,
  Cluster, // Forest, delta, etc.
  Object // River, tree, hill, lake, etc.
}

export interface IGeographicalFeature {
  type: GeographicalFeatureType;
  name: string;
  translations: string[];
}
