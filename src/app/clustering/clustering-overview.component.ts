import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Clusterables} from "../../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/models/clusterables-enum";

@Component({
  selector: 'app-clustering-overview',
  templateUrl: './clustering-overview.component.html',
  styleUrls: ['./clustering-overview.component.css']
})
export class ClusteringOverviewComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  title = 'app';
  selectedComponent = 0;
  selectedFeature : Clusterables = Clusterables.NDimensional;
  numOfClusters:number = 6;
  trainingDefinitionId: number = 25;
  trainingInstanceId: number;

  constructor() { }

  ngOnInit() {
  }
}
