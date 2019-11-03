# ngx-value

## Installation

To use ngx-value in your project just run:

```
npm install ngx-value
```

You can now access properties from external files using the @Value decorator.

## API:

### Decorators
```ts
@Value(name: string, file?: string): any
```

### Methods
```ts
Values(...files: string[]): () => () => Promise<any>
```

```ts
Get(property: string, file?: string): any
```

## Usage

It is necessary to load any external files before our angular application starts and as such we need to include some initialization logic into our app. As seen below, we make use of the APP_INITIALIZER provided by Angular which will allow us to run some code before the app actually starts running.

Afterwards just use @Value("...") or Get("...") to retrieve any property.

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
      useFactory: Values('assets/properties.json', 'assets/websites.json', 'assets/authors.json'),
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

  @Value('title') // Default location is "assets/properties.json"
  title: string = '- Not Found -'; // Default value

  @Value('subtitle')
  subtitle: string = '- Not Found -';

  @Value('google', 'assets/websites.json') // load from "assets/websites.json"
  google: string = '- Not Found -';

  @Value('stackoverflow', 'assets/websites.json')
  stackoverflow: string = '- Not Found -';

  @Value('angular', 'assets/websites.json')
  angular: string = '- Not Found -';

  @Value(null, 'assets/authors.json') // "null" property means it's an array
  authors: any = [];

  random: string = '- Not Found -';

  ngOnInit(): void {
    this.random = Get('random');
  }
}
```
