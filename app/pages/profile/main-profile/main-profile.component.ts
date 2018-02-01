import { Component} from '@angular/core';
import {UserService} from '../../../common/services/user.service';
import {Router} from '@angular/router';
import {DogCardService} from '../../../common/services/dog-card.service';
import {SearchService, IdogData} from '../../../common/services/search.service';

@Component({
  selector: 'main-profile',
  template: require('./main-profile.template.html'),
  styles: [ require('./main-profile.scss')]
})
export class mainProfileComponent {

  constructor (public userService: UserService, public router: Router, public dogCardService: DogCardService, public searchService: SearchService) {
    this.dogCardService.open = false;
  }

  public ngOnInit(): void {
    this.searchService.resetResults();
    this.searchService.queryObj = {};
    this.searchService.addQuery('reporter_id', this.userService.user.username);
    this.searchService.addQuery('pageSize', 45);
    this.searchService.search().add(() => {
      if (this.searchService.results && this.searchService.results.length) {
        this.dogCardService.setFoundDogs();
        this.dogCardService.setLostDogs();
      }
    });
  }

  public ngAfterViewInit(): void {
  }
};
