import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  TriggerLabel,
  WorkflowWhenComponent,
} from '../workflow-trigger/workflow-when.component';
import { WorkflowService } from '../workflow.service';
import { Observable } from 'rxjs';
import { WorkflowConditionsComponent } from '../workflow-conditions/workflow-conditions.component';

@Component({
  selector: 'app-worflow-system',
  standalone: true,
  imports: [WorkflowWhenComponent, WorkflowConditionsComponent],
  template: `
    <div>
      <app-workflow-when />
      <app-workflow-conditions />
    </div>
  `,
  styleUrl: './worflow-system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WorflowSystemComponent {
  readonly workflowService = inject(WorkflowService);

  readonly selectedTrigger$: Observable<TriggerLabel> =
    this.workflowService.getSelectedTrigger$();
}
