# ngx-value

[![npm](https://img.shields.io/npm/v/ngx-value?color=F33)](https://www.npmjs.com/package/ngx-value)
![npm](https://img.shields.io/npm/dt/ngx-value?color=F33)
![GitHub last commit](https://img.shields.io/github/last-commit/penrique/ngx-value?color=3B3)
![Build Status](https://travis-ci.org/penrique/ngx-value.svg?branch=master)
![GitHub](https://img.shields.io/github/license/penrique/ngx-value?color=%2339F)

`ngx-value` is an Angular library that provides an easy way to load JSON data from various HTTP sources and read its properties during runtime.

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
@Value(name: string, path?: string): any
```

```ts
@Path(path: string): any
```

### Methods
```ts
Values(...paths: string[]): Promise<any>
```

```ts
Get(property: string, path?: string): any
```

## Usage

First off, it is necessary to load any data before our angular application starts and as such we need to include some initialization logic into our app. As seen below, we make use of the `APP_INITIALIZER` provided by Angular which will allow us to run some code before the app actually starts running.

Afterwards just use `@Value` or `Get()` to retrieve any property.

By default, `@Value` will retrieve a property based on its path parameter. Otherwise, it will go for the class path set with `@Path`. If no path was set that way, it will use the first path passed in `@Values(...)`, and as last resort it will use `assets/properties.json` as the default path.

Keep in mind that you are allowed to call `Values(...)` at any time during runtime to continue loading JSON data into memory, wait for it to finish loading before attempting to use its properties though (it's a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)).

## Example 
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
@Path('assets/properties.json') // Default path for this class
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