import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowWhenComponent } from './workflow-when.component';

describe('WorkflowWhenComponent', () => {
  let component: WorkflowWhenComponent;
  let fixture: ComponentFixture<WorkflowWhenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowWhenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowWhenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
