import { JobBoardStateService } from './job-board-state.service';
import { Component, HostListener, inject } from '@angular/core';
import { JobBoardListComponent } from './job-board-list/job-board-list.component';
import { ButtonModule } from 'primeng/button';
import { JobBoardService } from './job-board.service';
import { JobPost } from './type/job-board';
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { JobBoardPaginationService } from './job-board-pagination.service';

@Component({
  selector: 'app-job-board',
  standalone: true,
  imports: [
    JobBoardListComponent,
    ButtonModule,
    AsyncPipe,
    CommonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './job-board.component.html',
  styleUrl: './job-board.component.scss',
})
export default class JobBoardComponent {
  @HostListener('window:scroll', ['$event.target'])
  onScroll(event: EventTarget): void {
    console.log('scroll', event);

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage =
      (scrollPosition / (documentHeight - windowHeight)) * 100;

    if (scrollPercentage > 90) {
      this.jobBoardStateService.setShouldLoadMore(true);
      window.scrollTo({
        top: scrollPosition - 100,
        behavior: 'smooth',
      });
    }
  }

  private readonly jobBoardService = inject(JobBoardService);

  private readonly jobBoardStateService = inject(JobBoardStateService);

  readonly isLoading$$ = new BehaviorSubject<boolean>(false);

  readonly jobPosts$: Observable<JobPost[]> = this.jobBoardService
    .getJobPostIds$()
    .pipe(
      tap(() => this.isLoading$$.next(true)),
      switchMap((ids) =>
        combineLatest(
          ids.map((id) => this.jobBoardService.getJobPost$(id))
        ).pipe(finalize(() => this.isLoading$$.next(false)))
      ),
      finalize(() => this.isLoading$$.next(false))
    );

  loadMore(): void {
    console.log('load more');
    this.jobBoardStateService.setShouldLoadMore(true);
  }
}
