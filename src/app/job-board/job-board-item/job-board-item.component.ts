import { Component, Input } from '@angular/core';
import { JobPost } from '../type/job-board';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-job-board-item',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './job-board-item.component.html',
  styleUrl: './job-board-item.component.scss',
})
export class JobBoardItemComponent {
  @Input() jobPost!: JobPost;
}
