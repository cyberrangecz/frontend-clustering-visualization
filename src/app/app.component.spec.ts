import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {
    RadarChartComponent
} from '../../projects/trainings-clustering-visualizations-library/src/lib/visualization/components/visualizations/radar-chart/radar-chart.component';


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
            providers: []
        }).compileComponents();
    }));

    it('should create the app', waitForAsync(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
