import { Component, OnInit } from '@angular/core';
import { Value, Get } from 'projects/ngx-value/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @Value('title') // default location is "assets/properties.json"
  title: string = '- Not Found -';

  @Value('subtitle')
  subtitle: string = '- Not Found -';

  @Value('google', 'assets/websites.json')
  google: string = '- Not Found -';

  @Value('stackoverflow', 'assets/websites.json')
  stackoverflow: string = '- Not Found -';

  @Value('angular', 'assets/websites.json')
  angular: string = '- Not Found -';

  @Value(null, 'assets/authors.json') // null means it's an array
  authors: any = [];

  random: string = '- Not Found -';

  ngOnInit(): void {
    console.log(this.title);
    this.random = Get('random');
  }

}
