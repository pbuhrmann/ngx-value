# ngx-value

[![npm version](https://badge.fury.io/js/ngx-value.svg)](https://badge.fury.io/js/ngx-value)
![npm](https://img.shields.io/npm/dt/ngx-value?color=39F)
![npm](https://img.shields.io/npm/v/ngx-value?color=39F)

`ngx-value` is an Angular library that provides an easy way to load JSON data from various HTTP sources and read their properties during runtime.

## Goal

There's always values we need to tweak and adjust depending on the environment, even though the project being deployed is still the same one. Or maybe we're just testing things out in an environment of our own and we'd like to make use of different configuration files and keep organized.

Anyhow, we can now use `ngx-value` to load a set of JSON data from any kind of source over HTTP and initialize variables with their properties by using the `@Value` decorator or just `Get()` them later on.

## Installation

To use ngx-value in your project just run:

```
npm install ngx-value
```

## API:

### Decorators
```ts
@Value(name: string, data?: string): any
```

### Methods
```ts
Values(...data: string[]): () => () => Promise<any>
```

```ts
Get(property: string, data?: string): any
```

## Usage

First off, it is necessary to load any data before our angular application starts and as such we need to include some initialization logic into our app. As seen below, we make use of the APP_INITIALIZER provided by Angular which will allow us to run some code before the app actually starts running.

Afterwards just use `@Value` or `Get()` to retrieve any property.

Also keep in mind that you are allowed to call `Values(...)` at any time to continue loading JSON data into memory, wait for it to finish loading though (it's a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)).

```ts
/**
 *  `app.module.ts`
 */

import { Values } from 'ngx-value';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => Values('assets/properties.json', 'assets/websites.json', 'assets/authors.json'),
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```ts
/**
 *  `app.component.ts`
 */

import { Value, Get } from 'ngx-value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @Value('title') // default location is "assets/properties.json"
  public title: string = '- Not Found -'; // Default value is "- Not Found -"

  @Value('angular', 'assets/websites.json') // load from "assets/websites.json"
  public angular: string = '- Not Found -';

  @Value(null, 'assets/authors.json') // null means it's an array
  public authors: any = [];
  
  @Value('some-property', 'http://127.0.0.1/anywhere.json') // load data from some other site
  public anywhere: string = '- Not Found -';

  ngOnInit(): void {
    this.random = Get('random');
  }
}
```
## Development server

Run `npm run start` to serve the demo at http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the demo project. The build artifacts will be stored in the /dist directory. Use the --prod flag for a production build.

Run `npm run lib` to build the library. The build artifacts will be stored in the /dist/ngx-value directory.

## Running tests

Run `npm run test` to execute unit tests.