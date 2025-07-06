import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobBoardStateService {
  private readonly shouldLoadMore$$ = new BehaviorSubject<boolean>(false);

  getShouldLoadMore$(): Observable<boolean> {
    return this.shouldLoadMore$$;
  }

  setShouldLoadMore(shouldLoadMore: boolean): void {
    this.shouldLoadMore$$.next(shouldLoadMore);
  }
}
