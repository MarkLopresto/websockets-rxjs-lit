import { AsyncDirective } from 'lit/async-directive.js';
import {
  Directive,
  directive,
  EventPart,
  DirectiveParameters,
} from 'lit/directive.js';
import { Observable, Subscription } from 'rxjs';

class ObserveDirective extends AsyncDirective {
  #subscription: Subscription = new Subscription();

  render(observable: Observable<unknown>) {
    this.#subscription = observable.subscribe({
      next: () => {
        console.log('Message received');
        this.setValue('Message received');
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        // closes the connection
        console.info('complete', this.#subscription);
        this.setValue('complete');

        // not needed as complete closes the connection
        // this.disconnected();
      },
    });
  }

  disconnected() {
    this.#subscription?.unsubscribe();
    console.log('this.#subscription', this.#subscription);
  }
}

export const observe = directive(ObserveDirective);
