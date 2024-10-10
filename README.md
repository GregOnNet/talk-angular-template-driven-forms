# Pride and Prejudice - Template Driven Forms

> **[Slides are available at SpeakerDeck](https://speakerdeck.com/gregonnet/pride-and-prejudice-template-driven-forms?)**

## Intro

Hey there 👋,

now that I know you are reading this, I have a confession to make. - I love forms. I love filling them out, I love submitting them, I love the form telling me what corrections I have to make.
But most of all I love if forms show a predictable behaviour all over the places.

And I know it efforts a lot of effort to build such forms.
This is because forms themself can have a steep curve of complexity.

It depends whether we talk about a login or a multistep registration and verification process.
You need to tackle forms differently depending of its dynamics.

Before we start let me say that Angular already provides a great toolkit to build forms.
We can either use template-driven forms or reactive forms.

And from my point of view reactive forms are used very frequently whereas template-driven forms are used for small and easy use-cases.

I am curious, what do you use in your project? 😉

## Why do we "dislike" template-driven forms?

When we go back in history, when Angular 2 was released. We only had template-driven forms.

... And they were fun. We had to-way data-binding to keep form values and our model in sync.
We got built-in validations that worked across multiple browsers. ... Well, except Internet Explorer, if I remember correctly. 🤗
But once we added more fields in to our forms and had multiple validations things got clunky.

Sometimes, we needed to listen to certain `(ngModelChange)` in order to get more complex validations or side-effects done.

We needed to handle the display of various errors.
Sometimes we got additional conditions, when to show which error.

Our templates exploded.

Now, the fun was gone.

The reason is, that we needed to maintain code in the template and in the component class.
We learned from that: Maybe it is not the best place to set up validations in the template.

Furthermore, it seemed template-driven forms do not to integrate well with Observables, although they do.

Maybe, you also remember handling an Array<T> of controls in the template.
There is no out-of-the-box solution we have in template-driven-forms.

### Summary

We dislike template-driven forms...

- fragmented setup in template and component class
- templates got too big
- handling a control-Array is inconvenient

> [!NOTE]
> Wow, I recognize it might not be the best start to list all the cons, although I want to advertise to use template-driven forms. 😅
> Hold on, we will get there!

## Why do we like reactive forms?

With Angular 4 reactive forms were introduced.

We were able to arrange controls and validators in de component class.
What was left were the binding the controls to the template.

With `FormArray` there was a clear way to deal with a list of controls of the same type.

We got factories to create forms with less boilerplate and we could directly subscribe to streams offered by the `FormGroup`.

Than, I started arguing that reactive forms...

- are more reactive
- better to test
- better typed
- and can solve highly dynamic use-cases
- blah, blah, blah...

### Summary

We like reactive forms because...

- more convenient way to create forms
- better integrations with streams
- better handling for lists of controls with `FormArray<T>`

## The unknown trade-offs between template-driven & reactive forms

The hype around reactive forms was real and we forgot about template-driven forms.
But we also forgot about things template-driven forms were already good at.
Template-driven forms are very declarative.
They are easy to use when it comes to bind a model to a control.
Binding to `ngModel` is more typ(o)-safe than binding to `formControlName` from reactive forms.
Behind the scenes template-driven forms instantiate `FormGroup`- & `FormControl`-structures us.
With reactive forms, we are doing this step, manually.
Even cooler, template-driven forms automatically remove unneeded controls from the model, if they are not needed, any more.

### Summary

Template-driven forms...

- have a declarative API
- create `FormGroup`- & `FormControl` behind the scenes
- remove `FormGroup`- & `FormControl` behind the scenes

> [!IMPORTANT]
> Long story, short!
> What if we could the best of both worlds?

This repository is here to proof that template-driven forms can scale as good as reactive forms.

## The goal

Providing a solution that allows you to build forms fast.
You will get a data driven approach letting you define validations in one place.
The forms will have a good level of abstraction, letting you create highly customizable forms tailored for the
needs of your customers but without the hassle of all the manual work needed to provide a good/standardized DX.

## The demo

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
