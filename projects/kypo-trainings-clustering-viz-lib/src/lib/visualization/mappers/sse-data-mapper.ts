import { SseDTO } from '../DTOs/sse-dto';
import { SseData } from '../models/sse-data';

export class SseDataMapper {
  static fromDTO(dto: SseDTO): SseData {
    const result = dto;
    return result;
  }
}
