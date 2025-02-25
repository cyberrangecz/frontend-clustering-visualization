import { environment } from '../environments/environment';
import { ClusteringVisualizationConfig } from '../../projects/clustering-visualization/src/public_api';

export const CustomConfig: ClusteringVisualizationConfig = {
    trainingServiceUrl: environment.statisticalVizConfig.trainingServiceUrl
};
