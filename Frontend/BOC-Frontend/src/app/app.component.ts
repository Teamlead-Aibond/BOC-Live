import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-minton',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mySubscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false; 
      }
    });
  }
  
  ngOnInit() {
    //console.log('app ngOnInit')
  }

  ngOnDestroy() {
    //console.log('app ngOnDestroy')
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
