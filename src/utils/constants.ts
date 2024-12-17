export const MONGODB_CONNEXION_NAME = 'mongodb';

export interface Root {
  generatedMaps: any[];
  raw: Raw;
  affected: number;
}

export interface Raw {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: any;
  upsertedCount: number;
  matchedCount: number;
}
