# TeamCityBuildScreen

This is a work in progress, not production ready. 

## Angular CLI
You'll need angular cli installed globally or use npx. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running with docker
1. Build with `docker build .`
1. Note image hash, start with `docker run -d -p 8008:80 *hash* `
1. Find running container hash with `docker container ls`
1. And stop with `docker container stop *hash from ls*`
