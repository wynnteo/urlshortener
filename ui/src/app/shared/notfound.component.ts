import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found">
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      p {
        font-size: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class NotFoundComponent {}
