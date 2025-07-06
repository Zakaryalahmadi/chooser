import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBoardListComponent } from './job-board-list.component';

describe('JobBoardListComponent', () => {
  let component: JobBoardListComponent;
  let fixture: ComponentFixture<JobBoardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobBoardListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobBoardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
