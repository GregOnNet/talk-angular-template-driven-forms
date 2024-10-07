# Pride and Prejudice - Template Driven Forms

## The goal

Providing a solution that allows you to build forms fast.
You will get a data driven approach letting you define validations in one place.
The forms will have a good level of abstraction, letting you create highly customizable forms tailored for the
needs of your customers but without the hassle of all the manual work needed to provide a good DX.

## The demo
> Feel free to play around with the demo application at: ???

Welcome to "Toolazon".
The shopping app to let you buy your frequently necessary tools and utilities to get your home projects done! 

### Form composition

### Automatic validation

- Conditional validation
- Asynchronous validation

### DX

- Type-Safety at development time
- shape validation at runt time

## History

- Angular 2 was released in 2016 with template-driven forms
- Angular 4 introduced reactive forms
- reactive forms advertised integration with RxJS
- reactive forms brought `FormBuilder`
- we started arguing 
  - reactive forms are better to test
  - reactive forms are better typed

### Reasons why we dislike template-driven forms

- Validations are shattered over Template and Code 
- Listen to single control changes can be a huge effort
- Integration with Observables seems to be worse compared to reactive forms
- There is no `FormArray` equivalence in template-driven forms
- Validations are painful and not reusable in different places

### What template-driven forms do behind the scences

- Creating `FormGroup` & `FormControl` instances behind the scenes.
- Offer access to the reactive form.
- **TODO: Check whether this is true without additional code...**
- form controls and form groups are removed automatically.
- Our form will only contain the controls and groups that it needs.

## Architecture

- A unidirectional dataflow
- Typ(o) safety
- Valibot Validation
- Async validators
- Declarative and reactive ViewModels

## Stack

- [Angular](angular.dev)
- [Nx](nx.dev)
- [Playwright](https://playwright.dev/dotnet/)
- [valibot](https://valibot.dev/api/array/)
- [@tanstack/query](https://tanstack.com/query/latest/docs/framework/angular/overview)
- [PrimeNG](https://primeng.org/)

## Attributions

The architecture is highly insipired by the articles of Brecht Billiet.
His blog at [Simplified Courses](https://www.simplified.courses/) provides a ton of unique insights that make you and your team more effective.

## Sources

### Simplified Courses
> Articles are sorted chronological

- [Template-driven or reactive forms in Angular](https://blog.simplified.courses/template-driven-or-reactive-forms-in-angular/)
- [Template-driven forms with form arrays in Angular](https://blog.simplified.courses/template-driven-forms-with-form-arrays/)
- [Angular Template-driven Forms state management](https://blog.simplified.courses/angular-template-driven-forms-state-management/)
- [Asynchronous Form Validators in Angular with Vest](https://blog.simplified.courses/asynchronous-form-validators-in-angular-with-vest/)
- [Making Angular template-driven forms type-safe](https://blog.simplified.courses/making-angular-template-driven-forms-typesafe/)
- [Introducing ngx-vest-forms: Simplify Complex Angular Forms](https://blog.simplified.courses/introducing-ngx-vest-forms/)

### Tim Deschryver

- [A practical guide to Angular Template-Driven Forms](https://timdeschryver.dev/blog/a-practical-guide-to-angular-template-driven-forms#)

### qupaya

- [The Ultimate Angular Form Type](https://qupaya.com/blog/the-ultimate-angular-form-type/)
