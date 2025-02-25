import { Clusterable } from './clusterable';

export interface TimeAfterHint extends Clusterable {
  level: number;
  timeSpentAfterHint: number;
  wrongFlagsAfterHint: number;
  timeSpentAfterHintNormalized: number;
  wrongFlagsAfterHintNormalized: number;
}
