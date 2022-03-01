import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

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
  selectedFeature = 0; //: Clusterables = 0;

  constructor() { }

  ngOnInit() {
    //this.data = data as any;
  }
}
