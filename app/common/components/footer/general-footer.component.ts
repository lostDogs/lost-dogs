import { Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'general-footer',
  template: require('./general-footer.template.html'),
  styles: [ require('./_general-footer.scss')]
})
export class generalFooterComponent {
  public newUser: boolean;
  constructor (public activatedRoute: ActivatedRoute, public router: Router) {

  }
  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      data => this.newUser = data.nU ? true : false
    );
  }

  public toPage(url: string, appName: string): void {
        let start, end, elapsed;
        start = new Date().getTime();
        // the lovely thing about javascript is that it's single threadded.
        // if this WORKS, it'll stutter for a split second, causing the timer to be off
        window.location.href = appName;
        end = new Date().getTime();
        elapsed = (end - start);
        // if there's no elapsed time, then the scheme didn't fire, and we head to the url.
        if (elapsed < 1) {
            window.location.href = url;
        }
    // window.open(appName);
  }

}