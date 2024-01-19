import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { observe } from './directives/rx-directive.js';
import { webSocket } from 'rxjs/webSocket';
import { tap, retry } from 'rxjs/operators';

@customElement('comp-websocket')
export class CompWebsocket extends LitElement {
  webSocketApi = 'wss://javascript.info/article/websocket/demo/hello';

  observer = {
    closingObserver: {
      next: () => console.log('The connection is going to be closed'),
    },
    closeObserver: {
      next: (event: { code: number; reason: string; wasClean: any }) => {
        if (event.wasClean) {
          console.log(
            `The connection is closed, code=${event.code} reason=${event.reason}`
          );
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          console.log(`Connection died, code=${event.code}`);
        }
      },
    },
    openObserver: {
      next: () => console.log('The connection is open'),
    },
  };

  wsSubjectConfig = {
    url: this.webSocketApi,
    ...this.observer,
    deserializer: (e: MessageEvent) => e.data,
  };

  wsSubject$ = webSocket(this.wsSubjectConfig);

  connect$ = this.wsSubject$.pipe(
    tap((data) => console.log({ data })),
    retry(3)
  );

  render() {
    return html`
      <slot></slot>
      <div class="card">
        <button @click=${(e: unknown) => this.wsSubject$.next(e)} part="button">
          Send message
        </button>
        <p>Status: ${observe(this.connect$)}</p>
        <button @click=${() => this.wsSubject$.complete()} part="button">
          Disconnect
        </button>
      </div>
    `;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'comp-websocket': CompWebsocket;
  }
}
