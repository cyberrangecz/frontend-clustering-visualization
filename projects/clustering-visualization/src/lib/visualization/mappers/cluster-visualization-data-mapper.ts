import { VisualizationDataDTO } from '../DTOs/visualization-data-dto';
import { ClusteringVisualizationData } from '../models/clustering-visualization-data';
import { ClusterDto } from '../DTOs/cluster-dto';

export class ClusterVisualizationDataMapper {
  static fromDTO(dto: VisualizationDataDTO | any): ClusteringVisualizationData {
    const result = new ClusteringVisualizationData();
    result.clusterData = [];
    for (const dtoKey in dto) {
      result.clusterData.push(dto[dtoKey] as ClusterDto);
    }
    return result;
  }
}
