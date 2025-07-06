import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./workflow-system/worflow-system/worflow-system.component'),
  },
  {
    path: 'job-board',
    loadComponent: () => import('./job-board/job-board.component'),
  },
  {
    path: 'memory-game',
    loadComponent: () => import('./memory-game/memory-game.component'),
  },
  {
    path: 'chooser',
    loadComponent: () => import('./chooser/chooser.component'),
  },
];
