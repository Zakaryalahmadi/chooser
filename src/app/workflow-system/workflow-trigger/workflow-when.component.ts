import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { filter, Subject, takeUntil } from 'rxjs';
import { WorkflowService } from '../workflow.service';

export enum WorkFlowTrigger {
  student_created = 'student_created',
  course_created = 'course_created',
}

export type TriggerLabel = { label: string };

export const WORKFLOW_TRIGGER_TO_LABEL: Record<WorkFlowTrigger, TriggerLabel> =
  {
    [WorkFlowTrigger.student_created]: { label: 'When Student Created' },
    [WorkFlowTrigger.course_created]: { label: 'When Course Created' },
  };

@Component({
  selector: 'app-workflow-when',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, DropdownModule, CardModule],
  templateUrl: './workflow-when.component.html',
  styleUrl: './workflow-when.component.scss',
})
export class WorkflowWhenComponent implements OnInit, OnDestroy {
  readonly selectedTriggerForm = new FormControl<TriggerLabel | null>(null);

  readonly triggerOptions = Object.values(WORKFLOW_TRIGGER_TO_LABEL);

  private readonly destroy$ = new Subject<void>();

  readonly workflowService = inject(WorkflowService);

  ngOnInit() {
    this.emitSelectedTrigger();
  }

  private emitSelectedTrigger() {
    this.selectedTriggerForm.valueChanges
      .pipe(
        filter((value): value is TriggerLabel => value !== null),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.workflowService.setSelectedTrigger(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
