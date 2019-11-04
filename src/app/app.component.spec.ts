import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Values } from 'projects/ngx-value/src';

describe('AppComponent', () => {
  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ]
    }).compileComponents().then(() => {
      Values('assets/properties.json', 'assets/websites.json', 'assets/authors.json')()().then(x => {
        done();
      });
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ngx-value'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ngx-value');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('ngx-value');
  });

  it(`should have as notFound '- Not Found -'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.notFound).toEqual('- Not Found -');
  });

  it('should render notFound', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.notFound').textContent).toContain('- Not Found -');
  });

  it(`should have as empty "null"`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.empty).toEqual(null);
  });

  it('should render empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.empty').textContent).toContain('');
  });

  it(`should have as random "This is a random text"`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    app.ngOnInit();
    expect(app.random).toEqual("This is a random text");
  });

  it('should render random', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.random').textContent).toContain('This is a random text');
  });

  it(`should have as authors a non-empty Array`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(true).toEqual(Array.isArray(app.authors) && app.authors.length > 0);
  });

  it('should render authors', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.author').textContent).toContain('J. K. Rowling');
    expect(compiled.querySelector('.book').textContent).toContain("Harry Potter and the Philosopher's Stone (1997)");
  });

});
