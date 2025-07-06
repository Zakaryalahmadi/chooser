import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  exhaustMap,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { JobPost } from './type/job-board';
import { JobBoardPaginationService } from './job-board-pagination.service';
import { JobBoardProxy } from './job-board.proxy';
import { JobBoardStateService } from './job-board-state.service';

export type JobBoardFromApi = {
  id: number;
  title: string;
  time: number;
  url: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class JobBoardService {
  private readonly jobBoardPaginationService = inject(
    JobBoardPaginationService
  );

  private readonly jobBoardProxy = inject(JobBoardProxy);

  readonly currentPage$$ = new BehaviorSubject<number>(0);

  getJobPostIds$(): Observable<number[]> {
    return combineLatest([
      this.jobBoardPaginationService.getMaxJobPosts$(),
    ]).pipe(
      tap(([maxJobPosts]) =>
        console.log('maxJobPosts', maxJobPosts, 'offset', 0)
      ),
      switchMap(([maxJobPosts]) =>
        this.jobBoardProxy
          .getJobPostIds$()
          .pipe(map((ids) => ids.slice(0, maxJobPosts)))
      )
    );
  }

  getJobPost$(id: number): Observable<JobPost> {
    return this.jobBoardProxy.getJobPost$(id).pipe(
      map((jobPost) => ({
        id,
        title: jobPost.title,
        timeInSeconds: jobPost.time,
        url: jobPost.url,
      }))
    );
  }
}
