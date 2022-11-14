import {ClusterVisualizationData} from '../models/cluster-visualization-data';
import {EuclidianDoublePoint} from '../models/eucledian-double-point';

export class VisualizationDataDTO {
    [index: number | string ]: ClusterVisualizationData | EuclidianDoublePoint
}
