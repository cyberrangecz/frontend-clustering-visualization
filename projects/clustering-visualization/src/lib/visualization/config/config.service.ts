import { Injectable } from '@angular/core';
import { ClusteringVisualizationConfig } from './trainings-clustering-visualizations';

@Injectable()
export class ConfigService {
  private readonly _config: ClusteringVisualizationConfig;
  private _trainingDefinitionId: number;
  private _trainingInstanceId: number;

  get trainingDefinitionId(): number {
    return this._trainingDefinitionId;
  }

  set trainingDefinitionId(value: number) {
    this._trainingDefinitionId = value;
  }

  get trainingInstanceId(): number {
    return this._trainingInstanceId;
  }

  set trainingInstanceId(value: number) {
    this._trainingInstanceId = value;
  }

  get config(): ClusteringVisualizationConfig {
    return this._config;
  }

  constructor(config: ClusteringVisualizationConfig) {
    this._config = config;
  }
}
