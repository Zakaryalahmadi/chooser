import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { WorkFlowTrigger } from '../workflow-trigger/workflow-when.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { WorkflowService } from '../workflow.service';
import { CommonModule } from '@angular/common';

//  Student = {
//   name: string;
//   age: number;
//   isStudent: boolean;
//   hobbies: string[];
// // };

/// on a diffrent type du genr : string | number | boolean | string[] | number[] | boolean[]

export type WorkflowAggregateConditionType =
  | string
  | number
  | boolean
  | string[]
  | number[];

export type WorkflowConditionLabel = { label: string };

export const WORKFLOW_TRIGGER_TO_CONDITION_LABEL: Record<
  WorkFlowTrigger,
  WorkflowConditionLabel[]
> = {
  [WorkFlowTrigger.student_created]: [{ label: 'Name' }, { label: 'Age' }],
  [WorkFlowTrigger.course_created]: [
    { label: 'Name' },
    { label: 'Description' },
  ],
};

export type WorkflowCondition = {
  label: string;
  value: string;
};

export type WorkflowOperators =
  | 'equal'
  | 'not equal'
  | 'greater than'
  | 'less than'
  | 'greater than or equal'
  | 'less than or equal';

export type WorkflowConditionFormGroup = FormGroup<{
  fields: FormControl<WorkflowConditionLabel[] | null>;
  operator: FormControl<WorkflowOperators | null>;
  value: FormControl<string | number | null>;
}>;

@Component({
  selector: 'app-workflow-conditions',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, DropdownModule, CommonModule],
  template: `
    <div>
      <form *ngIf="workflowConditionsFormArray.controls">
        <div
          class="flex gap-2 p-2"
          *ngFor="
            let workflowConditionFormGroup of workflowConditionsFormArray.controls
          "
        >
          <p-dropdown
            [formControl]="workflowConditionFormGroup.controls.fields"
            placeholder="select field"
          />
          <p-dropdown
            [formControl]="workflowConditionFormGroup.controls.operator"
            placeholder="select operator"
          />
          <p-dropdown
            [formControl]="workflowConditionFormGroup.controls.value"
            placeholder="select value"
          />
        </div>
      </form>

      <p-button
        label="Add Condition"
        icon="pi pi-plus"
        (onClick)="addCondition()"
      />
    </div>
  `,
  styleUrl: './workflow-conditions.component.scss',
})
export class WorkflowConditionsComponent {
  readonly workflowService = inject(WorkflowService);

  readonly selectedTrigger$ = this.workflowService.getSelectedTrigger$();

  readonly workflowConditionsFormArray =
    new FormArray<WorkflowConditionFormGroup>([]);

  addCondition() {
    const conditionFormGroup: WorkflowConditionFormGroup = new FormGroup({
      fields: new FormControl<WorkflowConditionLabel[] | null>(null),
      operator: new FormControl<WorkflowOperators | null>(null),
      value: new FormControl<string | number | null>(null),
    });

    this.workflowConditionsFormArray.push(conditionFormGroup);
  }
}
