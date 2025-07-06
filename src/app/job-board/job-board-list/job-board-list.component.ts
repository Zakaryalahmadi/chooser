import { Component, Input } from '@angular/core';
import { JobBoardItemComponent } from '../job-board-item/job-board-item.component';
import { JobPost } from '../type/job-board';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-board-list',
  standalone: true,
  imports: [JobBoardItemComponent, CommonModule],
  templateUrl: './job-board-list.component.html',
  styleUrl: './job-board-list.component.scss',
})
export class JobBoardListComponent {
  @Input() jobPosts!: JobPost[];
}
