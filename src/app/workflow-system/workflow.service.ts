import { Injectable } from '@angular/core';
import { TriggerLabel } from './workflow-trigger/workflow-when.component';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  readonly selectedTrigger$ = new BehaviorSubject<TriggerLabel | null>(null);

  setSelectedTrigger(trigger: TriggerLabel) {
    this.selectedTrigger$.next(trigger);
  }

  getSelectedTrigger$(): Observable<TriggerLabel> {
    return this.selectedTrigger$.pipe(
      filter((value): value is TriggerLabel => value !== null)
    );
  }
}
