import { VisualizationDataDTO } from '../DTOs/visualization-data-dto';
import { ClusteringVisualizationData } from '../models/clustering-visualization-data';
import { EuclidianDoublePoint } from '../models/eucledian-double-point';

export class RadarChartDataMapper {
    static fromDTO(dto: VisualizationDataDTO | any): ClusteringVisualizationData {
        // TODO refactor the condition?
        if (dto.constructor.name !== 'VisualizationData') {
            const result = new ClusteringVisualizationData();
            result.radarData = [];
            for (const dtoKey in dto) {
                result.radarData.push(dto[dtoKey] as EuclidianDoublePoint);
            }
            return result;
        }
        return dto;
    }
}
