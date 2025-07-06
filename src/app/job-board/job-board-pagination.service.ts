import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { JobBoardStateService } from './job-board-state.service';
import { JobBoardProxy } from './job-board.proxy';

export const INITIAL_JOB_POSTS = 10;

export const ADDITIONAL_JOB_POSTS = 6;

@Injectable({
  providedIn: 'root',
})
export class JobBoardPaginationService {
  private readonly jobBoardStateService = inject(JobBoardStateService);

  readonly INITIAL_JOB_POSTS = INITIAL_JOB_POSTS;

  readonly limit$$ = new BehaviorSubject<number>(INITIAL_JOB_POSTS);

  getMaxJobPosts$(): Observable<number> {
    return combineLatest([
      this.jobBoardStateService.getShouldLoadMore$(),
      of(31),
    ]).pipe(
      map(([shouldLoadMore, jobPostsLength]) => {
        const isLastPage = this.limit$$.value >= jobPostsLength!;
        const limit =
          shouldLoadMore && !isLastPage
            ? this.limit$$.value + ADDITIONAL_JOB_POSTS
            : this.limit$$.value;

        this.limit$$.next(limit);

        console.log('limit', limit);

        return limit;
      })
    );
  }
}
