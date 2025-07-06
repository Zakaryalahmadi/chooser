import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobBoardItemComponent } from './job-board-item.component';

describe('JobBoardItemComponent', () => {
  let component: JobBoardItemComponent;
  let fixture: ComponentFixture<JobBoardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobBoardItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobBoardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
