# NgTaskMonitor

## Purpose
This is a little demo project which represents a part of my knowledge what I worked at the previous workplace.

It has been written with Angular 14v framework.

Angular CLI version: 14.2.7

## Feautres
* Thema changing: ligth, dark, blueDragon
* Responsive site: Angular material
* Task statistic with chart.js
* Measuring task time: Countdown clock
* Reactive programming: RxJs
* Rest time calculation: Web-worker, sub-threading

## Platform types
* Web version 
* Desktop version by ElectronJs

## Branch types
* main: is sealed, incluces Angular front-end only.
* inElectronJs: is sealed, implemented ElectronJs framework to run in desktop.
* inFirebase: is sealed, connected with Google Firebase. It haven't been done yet!
    * Temporary: storing data in cookies storage.
* sub-folder names:
    - frontend/ => Angular front-end changes
    - el/       => Changes for the ElectronJs branch
    - fb/       => Features for the Firebase branch
    - bug/      => bug fixxing for all branch

## Development server
__Pay attantion:__ It is different in "inElectornJs" and "inFirebase" branch!

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build.prod` to build the project. The build artifacts will be stored in the `dist/ng-task-monitor` directory.

## Deploying process
1. Run the `npm run build.prod` command in cli
2. Copy the code form `dist/ng-task-monitor` into that folder of the web server where it display the content. It depends on the configuration settings.
    * Ordinary path in linux server: var/www/domainName/public_html

## Running unit tests

Run `npm run test` to execute the unit tests

## Running eslint 
Check js syntax error, code format in your project.

Run `npm run lint` to execute the eslint running.

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
