import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class OnDestroyService implements OnDestroy {

  constructor() { }

  protected destroy$: Subject<boolean> = new Subject<boolean>();

  public ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
      this.destroy$.unsubscribe();
  }
}
