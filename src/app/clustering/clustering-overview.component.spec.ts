import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClusteringOverviewComponent } from './clustering-overview.component';

describe('ClusteringOverviewComponent', () => {
  let component: ClusteringOverviewComponent;
  let fixture: ComponentFixture<ClusteringOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusteringOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusteringOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
