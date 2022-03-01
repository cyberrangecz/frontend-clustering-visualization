import {environment} from '../environments/environment';
import {ClusteringVisualizationConfig} from '../../projects/kypo-trainings-clustering-viz-lib/src/public_api';

export const CustomConfig: ClusteringVisualizationConfig = {
  trainingServiceUrl: environment.trainingServiceUrl,
  elasticSearchServiceUrl: environment.elasticSearchServiceUrl
};
