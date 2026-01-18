# NgTaskMonitor

## Recent Updates

### ElectronJS Upgrade to v39 (January 2026)
* **Branch**: `copilot/upgrade-electronjs-v39`
* **Electron**: 21.2.2 → 39.2.7 (Latest stable)
* **Node.js**: 16.x → 22.20.0 LTS (bundled with Electron 39, EOL: April 2027)
* **Electron Forge**: 6.0.0 → 7.10.2
* **Security**: Implemented all modern Electron security best practices
  - `nodeIntegration: false`
  - `contextIsolation: true`
  - Secure IPC through contextBridge
* Dual-mode support: Application now works in both web and Electron environments
* See `UPGRADE_NOTES.md` for detailed upgrade information

### Angular Framework from v14 => v21
* Created upgrading plans with AI and my knowledge, the sources are in 'angular-upgrade-plan' folder.
* Branch name: 'copilot/upgrade-angular-to-v21'
* Applying the latest features of angular such as standalone, control flow syntax, adapting signals


## Purpose
This is a little demo project which represents a part of my knowledge what I worked at the previous workplace.

It has been written with Angular 21 framework and can run as both a web application and a desktop application using Electron 39.

**Current Version**:
- Angular CLI version: 21.0.5
- Electron version: 39.2.7
- Node.js version: 22.20.0 LTS

## Features
* Theme changing: light, dark, blueDragon
* Responsive site: Angular material
* Task statistic with Chart.js v4
* Measuring task time: Countdown clock
* Reactive programming: RxJS
* Rest time calculation: Web-worker, sub-threading
* Modern Angular v21 features: Block control flow (@if, @for)

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

### Web Version
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Electron Desktop Version
1. Build the Angular application: `npm run build.prod`
2. Start Electron: `npm run start.electron`

Or use Electron Forge: `npm run start.forge`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

### Web Version
Run `npm run build.prod` to build the project. The build artifacts will be stored in the `dist/ng-task-monitor` directory.

### Electron Desktop Version
1. Build Angular: `npm run build.prod`
2. Package Electron app: `npm run package`
3. Create installers: `npm run make`

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
