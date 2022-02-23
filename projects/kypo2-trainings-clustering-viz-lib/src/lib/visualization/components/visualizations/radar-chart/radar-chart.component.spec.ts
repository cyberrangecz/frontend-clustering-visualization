import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { View } from '../../models/view.enum';
import { RadarChartComponent } from './training-analysis.component';
import { ColumnHeaderComponent } from '../column-header/column-header.component';
import { LoadDataService } from '../../services/load-data.service';
import { D3Service } from 'd3-ng2-service';
import { PapaParseModule, Papa } from 'ngx-papaparse';
 import { from as fromPromise } from 'rxjs';
import {ConfigService} from '../../config/config.service';
import {AppConfig} from '../../../app.config';
describe('TrainingAnalysisComponent', () => {
  let component: RadarChartComponent;
  let fixture: ComponentFixture<RadarChartComponent>;
  const testConfig: AppConfig = {
    levelsTimePlan: [1200, 1500, 1900, 2100, 2200, 2200],
    trainingColors: ['#1c89b8', '#20ac4c', '#ff9d3c', '#fc5248'],
    darkColor: '#2f2f2f',
    eventShapePaths: {
        'hint': 'M15,7.9c0,3.9-3.1,7-7,7c-3.9,0-7-3.1-7-7c0-3.9,3.1-7,7-7C11.9,0.9,15,4,15,7.9z',
        'skip': 'M3.4,0.9L8,5.5l4.7-4.6l2.3,2.2L10.4,8l4.7,4.7L12.9,15L8,10.2l-4.8,4.9l-2.4-2.3L5.6,8L0.9,3.5L3.4,0.9z',
        'solution' : 'M0.7,10.2l2-3L6,9.5l6.5-8.1l2.9,2.3L6.6,14.6L0.7,10.2z',
        'group' : 'M17.5,9c0,4.7-3.8,8.5-8.5,8.5c-4.7,0-8.5-3.8-8.5-8.5c0-4.7,3.8-8.5,8.5-8.5C13.7,0.5,17.5,4.3,17.5,9z'
    },
    minBarHeight: 18,
    maxBarHeight: 60,
    maxZoomValue: 10,
    zoomStep: 0.25,
    simulationInterval: 800,
    loadDataInterval: 5000,
    defaultView: View.overview
  };
  const loadServiceStub: any = {
    getTrainingAndPlanData: function(apiUrl: string, trainingId: string, levelsTimePlan: number[]) {
      return fromPromise(new Promise(function (resolve, reject) {
            const data = {
              'trainingDataset': [
                {
                  'team': '9003585',
                  'events': [],
                  'totalTime': 4599,
                  'start': 311,
                  'level1': 430,
                  'level2': 2343,
                  'currentState': 'level3'
                },
                {
                  'team': '9003580',
                  'events': [
                    {
                      'type': 'hint',
                      'name': 'Hint 3 taken',
                      'time': 284,
                      'level': 3
                    }
                  ],
                  'totalTime': 4594,
                  'start': 316,
                  'level1': 647,
                  'level2': 960,
                  'currentState': 'level3'
                },
                {
                  'team': '9003584',
                  'events': [
                    {
                      'type': 'solution',
                      'name': 'Returned from help level',
                      'time': 587,
                      'level': 1
                    },
                    {
                      'type': 'skip',
                      'name': 'Level cowardly skipped',
                      'time': 1869,
                      'level': 1
                    },
                    {
                      'type': 'hint',
                      'name': 'Hint 1 taken',
                      'time': 321,
                      'level': 2
                    },
                  ],
                  'totalTime': 4176,
                  'start': 734,
                  'level1': 1869,
                  'level2': 575,
                  'level3': 993,
                  'currentState': 'level4'
                },
              ],
              'planDataset': [
                {
                  'team': '9003585',
                  'start': 0,
                  'level1': 1000,
                  'level2': 1000,
                  'level3': 1000,
                  'level4': 1000
                },
                {
                  'team': '9003580',
                  'start': 0,
                  'level1': 1000,
                  'level2': 1000,
                  'level3': 1000,
                  'level4': 1000
                },
                {
                  'team': '9003584',
                  'start': 0,
                  'level1': 1000,
                  'level2': 1000,
                  'level3': 1000,
                  'level4': 1000
                },
              ],
              'levels': [
                'start',
                'level1',
                'level2',
                'level3',
                'level4'
              ],
              'levelsTimePlan': [1000, 1000, 1000, 1000],
              'time': 4910
            };
            resolve(data);
        }));
      }
    };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RadarChartComponent,
        ColumnHeaderComponent
      ],
      imports: [
        FormsModule,
        PapaParseModule
      ],
      providers: [
        D3Service,
        Papa,
        { provide: LoadDataService, useValue: loadServiceStub },
        { provide: AppConfig, useValue: testConfig },
        ConfigService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* colors */

  it('should return transparent color before first level in progress view', waitForAsync(() => {
    component.switchToProgressView();
    expect(component.getColor(0)).toEqual('transparent');
    expect(component.getPlanColor(0)).toEqual('transparent');
    expect(component.getLightenedColor(0)).toEqual('transparent');
  }));

  it('should return first color for first level in progress view', waitForAsync(() => {
    component.switchToProgressView();
    expect(component.getColor(1)).toEqual('#1c89b8');
    expect(component.getPlanColor(1)).toEqual('#0e6f90');
    expect(component.getLightenedColor(1)).toEqual('#bbdcea');
  }));

  it('should repeat colors when all have been used in progress view', waitForAsync(() => {
    component.switchToProgressView();
    expect(component.getColor(5)).toEqual('#1c89b8');
    expect(component.getPlanColor(5)).toEqual('#0e6f90');
    expect(component.getLightenedColor(5)).toEqual('#bbdcea');
  }));

  it('should return first color for first level in final overview', waitForAsync(() => {
    component.switchToFinalOverview();
    expect(component.getColor(0)).toEqual('#1c89b8');
    expect(component.getPlanColor(0)).toEqual('#0e6f90');
    expect(component.getLightenedColor(0)).toEqual('#bbdcea');
  }));

  it('should repeat colors when all have been used in final overview', waitForAsync(() => {
    component.switchToFinalOverview();
    expect(component.getColor(4)).toEqual('#1c89b8');
    expect(component.getPlanColor(4)).toEqual('#0e6f90');
    expect(component.getLightenedColor(4)).toEqual('#bbdcea');
  }));

  /* time */

  it('should return correct time string for given seconds', waitForAsync(() => {
    expect(component.getTimeString(0)).toEqual('00:00:00');
    expect(component.getTimeString(60)).toEqual('00:01:00');
    expect(component.getTimeString(1060)).toEqual('00:17:40');
    expect(component.getTimeString(3600)).toEqual('01:00:00');
    expect(component.getTimeString(363600)).toEqual('101:00:00');
  }));

  /* levels */

  it('should contain 4 level columns in final overview', waitForAsync(() => {
    component.switchToFinalOverview();
    fixture.whenStable().then(() => {
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const levelElements = nativeElement.querySelectorAll('.training-layer');
        expect(levelElements.length).toEqual(4);
    });
  }));

  it('should contain 1 empty column before training start and 4 level columns in progress view', waitForAsync(() => {
    component.switchToProgressView();
    fixture.whenStable().then(() => {
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const levelElements = nativeElement.querySelectorAll('.training-layer');
        expect(levelElements.length).toEqual(5);
    });
  }));

   it('each level should have the right color in final overview', waitForAsync(() => {
    component.switchToFinalOverview();
    fixture.whenStable().then(() => {
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const levelElements = nativeElement.querySelectorAll('.training-layer');
        expect(levelElements[0].getAttribute('fill')).toEqual('#1c89b8');
        expect(levelElements[1].getAttribute('fill')).toEqual('#20ac4c');
        expect(levelElements[2].getAttribute('fill')).toEqual('#ff9d3c');
        expect(levelElements[3].getAttribute('fill')).toEqual('#fc5248');
    });
  }));

  it('each level should have the right color in progress view', waitForAsync(() => {
    component.switchToProgressView();
    fixture.whenStable().then(() => {
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const levelElements = nativeElement.querySelectorAll('.training-layer');
        expect(levelElements[0].getAttribute('fill')).toEqual('transparent');
        expect(levelElements[1].getAttribute('fill')).toEqual('#1c89b8');
        expect(levelElements[2].getAttribute('fill')).toEqual('#20ac4c');
        expect(levelElements[3].getAttribute('fill')).toEqual('#ff9d3c');
        expect(levelElements[4].getAttribute('fill')).toEqual('#fc5248');
    });
  }));

  /* teams */

  it('should contain a row for each team', waitForAsync(() => {
    fixture.whenStable().then(() => {
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const levelElement = nativeElement.querySelector('.training-layer');
        const levelSegment = levelElement.querySelectorAll('rect');
        expect(levelSegment.length).toEqual(3);
    });
  }));

  it('should sort by name correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
        component.onSortValueChange('name', true);
        let teamsWraper: any = fixture.debugElement.query(By.css('#ctf-progress-teamcolumn')).nativeElement;
        fixture.detectChanges();
        let teams = teamsWraper.querySelectorAll('.data text');
        expect(teams[0].textContent).toEqual('9003580');
        expect(teams[1].textContent).toEqual('9003584');
        expect(teams[2].textContent).toEqual('9003585');

        component.onSortValueChange('name', false);
        teamsWraper = fixture.debugElement.query(By.css('#ctf-progress-teamcolumn')).nativeElement;
        fixture.detectChanges();
        teams = teamsWraper.querySelectorAll('.data text');
        expect(teams[0].textContent).toEqual('9003585');
        expect(teams[1].textContent).toEqual('9003584');
        expect(teams[2].textContent).toEqual('9003580');
    });
  }));

   it('should sort by time correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
        component.onSortValueChange('time', true);
        let teamsWraper: any = fixture.debugElement.query(By.css('#ctf-progress-teamcolumn')).nativeElement;
        fixture.detectChanges();
        let teams = teamsWraper.querySelectorAll('.data text');
        expect(teams[0].textContent).toEqual('9003584');
        expect(teams[1].textContent).toEqual('9003580');
        expect(teams[2].textContent).toEqual('9003585');

        component.onSortValueChange('time', false);
        teamsWraper = fixture.debugElement.query(By.css('#ctf-progress-teamcolumn')).nativeElement;
        fixture.detectChanges();
        teams = teamsWraper.querySelectorAll('.data text');
        expect(teams[0].textContent).toEqual('9003585');
        expect(teams[1].textContent).toEqual('9003580');
        expect(teams[2].textContent).toEqual('9003584');
    });
  }));

  it('should sort by level correctly', waitForAsync(() => {
    fixture.whenStable().then(() => {
        component.onSortValueChange('level', true, 3);
        let teamsWraper: any = fixture.debugElement.query(By.css('#ctf-progress-teamcolumn')).nativeElement;
        fixture.detectChanges();
        let teams = teamsWraper.querySelectorAll('.data text');
        expect(teams[0].textContent).toEqual('9003584');
        expect(teams[1].textContent).toEqual('9003585');
        expect(teams[2].textContent).toEqual('9003580');

        component.onSortValueChange('level', false, 3);
        teamsWraper = fixture.debugElement.query(By.css('#ctf-progress-teamcolumn')).nativeElement;
        fixture.detectChanges();
        teams = teamsWraper.querySelectorAll('.data text');
        expect(teams[0].textContent).toEqual('9003580');
        expect(teams[1].textContent).toEqual('9003585');
        expect(teams[2].textContent).toEqual('9003584');
    });
  }));

  /* events */

  it('should have the right count of events', waitForAsync(() => {
    fixture.whenStable().then(() => {
        component.onSortValueChange('name', false);
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const eventsWrapper = nativeElement.querySelector('.events'),
            allEvents = eventsWrapper.querySelectorAll('.event'),
            eventRows = eventsWrapper.querySelectorAll('.events-row'),
            firstTeamEvents = eventRows[0].querySelectorAll('.event'),
            secondTeamEvents = eventRows[1].querySelectorAll('.event');
        expect(allEvents.length).toEqual(4);
        expect(firstTeamEvents.length).toEqual(0);
        expect(secondTeamEvents.length).toEqual(3);
    });
  }));

  it('events should have the right color as the level', waitForAsync(() => {
    fixture.whenStable().then(() => {
        component.onSortValueChange('name', false);
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const eventsWrapper = nativeElement.querySelector('.events'),
            eventRows = eventsWrapper.querySelectorAll('.events-row'),
            secondTeamEvents = eventRows[1].querySelectorAll('.event');
        expect(secondTeamEvents[0].getAttribute('fill')).toEqual('#1c89b8');
        expect(secondTeamEvents[1].getAttribute('fill')).toEqual('#1c89b8');
        expect(secondTeamEvents[2].getAttribute('fill')).toEqual('#20ac4c');
    });
  }));

  it('events in unfinished level should have dark color', waitForAsync(() => {
    fixture.whenStable().then(() => {
        component.onSortValueChange('name', false);
        const nativeElement: any = fixture.debugElement.query(By.css('.ctf-progress')).nativeElement;
        fixture.detectChanges();
        const eventsWrapper = nativeElement.querySelector('.events'),
            eventRows = eventsWrapper.querySelectorAll('.events-row'),
            thirdTeamEvents = eventRows[2].querySelectorAll('.event');
        expect(thirdTeamEvents[0].getAttribute('fill')).toEqual('#2f2f2f');
    });
  }));

});
