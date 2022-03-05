import {WrongFlags} from "../models/wrong-flags";
import {Clusterable} from "../models/clusterable";

export class ClusterDto {
    points: Clusterable[];
    center: Clusterable[];
}
