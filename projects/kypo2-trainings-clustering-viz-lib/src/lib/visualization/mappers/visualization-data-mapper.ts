import { VisualizationDataDTO } from '../DTOs/visualization-data-dto';
import { VisualizationData } from '../models/visualization-data';
import { PlayerMapper } from './player-mapper';

export class VisualizationDataMapper {
  static fromDTO(dto: VisualizationDataDTO): VisualizationData {
    const result = new VisualizationData();
    return result;
  }
}

