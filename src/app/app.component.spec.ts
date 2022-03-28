import { TestBed, waitForAsync } from '@angular/core/testing';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
// import { AppConfig, CTF_PROGRESS_CONFIG } from './app.config';
// import { D3Service } from 'd3-ng2-service';
import {RadarChartComponent} from "../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/components/visualizations/radar-chart/radar-chart.component";



describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RadarChartComponent
      ],
      imports: [
        FormsModule,
        HttpClientModule
      ],
      providers: [
        // D3Service,
        // { provide: AppConfig, useValue: CTF_PROGRESS_CONFIG }
      ]
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
