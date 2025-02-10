import { environment } from '../environments/environment';
import { ClusteringVisualizationConfig } from '../../projects/trainings-clustering-visualizations-library/src/public_api';

export const CustomConfig: ClusteringVisualizationConfig = {
    trainingServiceUrl: environment.statisticalVizConfig.trainingServiceUrl
};
