import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Clusterables} from "../../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/models/clusterables-enum";
import {element} from "protractor";

export enum Components {
  SCATTER,
  LINE_CHART,
  RADAR_CHART
}

@Component({
  selector: 'app-clustering-overview',
  templateUrl: './clustering-overview.component.html',
  styleUrls: ['./clustering-overview.component.css']
})
export class ClusteringOverviewComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  title = 'app';
  data:JSON;
  test;
  selectedComponent = 0;
  COMPONENTS = Components;
  selectedFeature : Clusterables = Clusterables.NDimensional;
  numOfClusters:number = 6;
  trainingDefinitionId: number;
  trainingInstanceId: number = 25;

  constructor() { }

  ngOnInit() {
    //this.data = data as any;
  }
}
