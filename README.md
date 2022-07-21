# NgTaskMonitor

## Purpose
This is a little demo project which represents a part of my knowledge what I worked at the previous workplace.

It has been written with Angular12 framework.

Angular CLI version: 12.2.15

## Feautres
* Thema changing: ligth, dark, blueDragon
* Responsive site: Angular material
* Task statistic with chart.js
* Measuring task time: Countdown clock
* Reactive programming: RxJs
* Rest time calculation: Web-worker

## Platform types
* Web - storing data online
* Desktop with ElectronJs

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build.prod` to build the project. The build artifacts will be stored in the `dist/ng-task-monitor` directory.

## Running unit tests

Run `npm run test` to execute the unit tests

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

___
## Angular Performance Techniques
* Compilation process: AoT - Ahead of Time
* Change Detection Strategy: OnPush
* Avoiding computation in template(html) files
* trackBy - for loop
* Using pure pipes, not filtering
* Avoid memory leak - ngOnDestroy: unsubscribe from Observables stream
* Lazy loading - modules
* sub-thread: Web-worker

Link here: https://www.xenonstack.com/blog/performance-optimization-in-angular
