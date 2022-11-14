import { VisualizationDataDTO } from "../DTOs/visualization-data-dto";
import { VisualizationData } from "../models/visualization-data";
import { ClusterDto } from "../DTOs/cluster-dto";

export class ClusterVisualizationDataMapper {
  static fromDTO(dto: VisualizationDataDTO): VisualizationData {
    const result = new VisualizationData();
    result.clusterData = [];
    for (const dtoKey in dto) {
      result.clusterData.push(dto[dtoKey] as ClusterDto);
    }
    return result;
  }
}
