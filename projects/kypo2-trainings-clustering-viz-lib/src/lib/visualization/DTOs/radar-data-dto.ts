import { PlayerDTO } from './player-dto';
import {RadarPoint} from "../models/radar-point";

export class RadarDataDto {
    points: RadarPoint[];
    center: RadarPoint[];
    //players: PlayerDTO[];
}
