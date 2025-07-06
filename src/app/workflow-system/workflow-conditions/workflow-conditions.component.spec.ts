import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowConditionsComponent } from './workflow-conditions.component';

describe('WorkflowConditionsComponent', () => {
  let component: WorkflowConditionsComponent;
  let fixture: ComponentFixture<WorkflowConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowConditionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkflowConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
