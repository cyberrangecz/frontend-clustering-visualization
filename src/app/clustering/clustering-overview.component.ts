import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {Clusterables} from '../../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/models/clusterables-enum';
import {Components} from '../../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/models/components-enum';

@Component({
  selector: 'app-clustering-overview',
  templateUrl: './clustering-overview-analysis.component.html', // <-- this one is for standalone analysis
  //templateUrl: './clustering-overview.component.html',
  styleUrls: ['./clustering-overview.component.css']
})
export class ClusteringOverviewComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;

  clusterables = Clusterables;
  components = Components;
  selectedFeature : Clusterables = Clusterables.NDimensional;
  selectedComponent: Components = Components.RADAR_CHART;
  numOfClusters = 6;
  trainingDefinitionId = 25;
  trainingInstanceIds: number[];
  level = 0;
  isSubmenuOpen = true;

  // for analysis with standalone backend
  trainingLevels = {
    8: {},
    25: {
      'Level 3': 61,
      'Level 4': 62,
      'Level 5': 63,
      'Level 6': 64,
      'Level 7': 65,
      'Level 8': 66,
    },
    27: {
      'Level 2': 78,
      'Level 3': 80,
      'Level 4': 81,
      'Level 5': 82,
      'Level 6': 85,
      'Level 7': 86,
      'Level 8': 87
    },
    60: {
      'Level 2': 235,
      'Level 3': 236,
      'Level 4': 237,
      'Level 5': 238,
      'Level 6': 239
    },
    64: {
      'Level 2': 264,
      'Level 3': 265,
      'Level 4': 266,
      'Level 5': 267,
      'Level 6': 268
    }
  }

  selectionChange() {
    this.level = 0;
  }

  clusterChange(change) {
    this.numOfClusters = change.target.value;
  }

  toggleView(isOpen: boolean) {
    console.log(isOpen);
  }
}
