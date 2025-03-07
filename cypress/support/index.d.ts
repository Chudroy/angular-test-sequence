/// <reference types="cypress" />

declare global {
    namespace Cypress {
      interface Chainable<Subject = any> {
        /**
         * Custom command to select a day in the currently visible Angular Material calendar.
         * @param day Numeric day of the month to select (e.g., 15).
         */
        selectDayOfCurrentMonth(day: number): Chainable<Element>;
      }
    }
  }
  
  export {};
  