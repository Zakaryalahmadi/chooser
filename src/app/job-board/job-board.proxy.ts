import { inject, Injectable } from '@angular/core';
import { JobBoardFromApi, JobBoardService } from './job-board.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { JobBoardStateService } from './job-board-state.service';

@Injectable({
  providedIn: 'root',
})
export class JobBoardProxy {
  private readonly hackerNewsBaseUrl = 'https://hacker-news.firebaseio.com/v0';

  private readonly http = inject(HttpClient);

  getJobPostIds$(): Observable<number[]> {
    return this.http.get<number[]>(`${this.hackerNewsBaseUrl}/jobstories.json`);
  }

  getJobPost$(id: number): Observable<JobBoardFromApi> {
    return this.http.get<JobBoardFromApi>(
      `${this.hackerNewsBaseUrl}/item/${id}.json`
    );
  }
}
