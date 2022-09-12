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
1. Run it to local: `npm start`.
    * It creates a build from angular sources.
    * After it runs the electron environment(in local) with the built version of the project.
    * Finally, elentron window displays the app.

2. Only just creating a build: `npm run build.prod`.

## Deploying process
1. missing

## Running unit tests

Run `npm run test` to execute the unit tests

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
___
# Electron Performance ways
- DevTool window(f12): look at 'Performance' and 'Memory' tabs while your app is running.

1. Outside bundles using
    * Look at size of dependencies(basic, devDependencies)
    * Measuring `require()` - loading,
    * `require()` is expensive operation to attach file.
    * You really need the bundles/libraries if you don't use 90% of features?
2. Loading bundles/your code at current part.
    * We ordinary using `require()` function at the top of the file. The all bundles need to be loaded from the beginning?
    * Examine which libraries are mandatory to be loaded at the beginning and which of them are not!
    * You can also call `require()` to attach bundles when calling the methods of the controller or the main process. Like the `<script defer>` loading.
3. No blocking main-process/browser main-thread
    * It is repsonsible for managing all-threads, disk I/O and UI rendering thread and so on.
        * Not sleeping main thread to wait for arriving data/ doing something!
    * Avoiding **synchronos IPC (Intel Process Communication)** using. It is easy to block UI thread.
    * File writing has to be async, avoding synchoronos process.
4. No blocking renderer process
    * Loading `<script>` tags, css files should be in the end of the <body> therefore the basic content loads easily.
    * Using **defer or async** attribute of the `script` tag. They will be attached when they are ready!
    * Using **web-workers** to delegate tasks in the background, using `requestIdleCallback()` for callback fn.
5. Avoid attaching polyfills
    * Avoding JQuery using.
        * Why? You have everything to do DOM manupalition by Angular features.
    * Polifill converts new features to older for older browser(IE). 
    The cromium engine (electronJs uses it) support new features, ES libraries, older func converting unwanted!
    * If you using `TypeScript`, the target ES library is the latest.
6. Outside newwork requests
    * should avoid the outside link which donwloads sources, like google font.
    Desktop app does not download any resource from the net.
        * E.g.: `<link rel="preconnect" href="https://fonts.gstatic.com">` in index.html.

___
# Angular Performance Techniques
* Compilation process: AoT - Ahead of Time
* Change Detection Strategy: OnPush
* Avoiding computation in template(html) files
* trackBy - for loop
* Using pure pipes, not filtering
* Avoid memory leak - ngOnDestroy: unsubscribe from Observables stream
* Lazy loading - modules
* sub-thread: Web-worker

Link here: https://www.xenonstack.com/blog/performance-optimization-in-angular
