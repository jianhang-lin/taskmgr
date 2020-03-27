import { ErrorObserver, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/*declare module 'rxjs' {
  interface Observable<T> {
    debug: (...any) => Observable<T>;
  }
}
Observable.prototype.debug = function(message: string) {
  return this.do(
    (next) => {
      if (!environment.production) {
        console.log(message, next);
      }
    },
    (error) => {
      if (!environment.production) {
        console.error('Error>>', message, error);
      }
    },
    () => {
      if (!environment.production) {
        console.log('Completed - ');
      }
    }
  );
}*/
export const debug = (message: string) => source => Observable.create(subscriber => {
  const subscription = source.subscribe(
    value => {
      if (!environment.production) {
        console.log(message, value);
      }
      subscriber.next(value);
    },
    err => {
      if (!environment.production) {
        console.error('Error>>', message, err);
      }
      subscriber.error(err);
    },
    () => {
      if (!environment.production) {
        console.log('Completed - ');
      }
      subscriber.complete(message);
    }
  );
  return subscription;
});

