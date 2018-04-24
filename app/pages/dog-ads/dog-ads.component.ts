import {Component, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router,  Params} from '@angular/router';
import {UserService} from '../../common/services/user.service';
import {DogCardService} from '../../common/services/dog-card.service';

@Component({
  selector: 'dog-ads',
  template: require('./dog-ads.template.html'),
  styles: [ require('./dog-ads.scss')]
})

export class DogAdsComponent {
  public dogId: string;
  public mappedData: any;
  public mobile: boolean;
  public location: {lat: number, lng: number};

  constructor (
    public dogService: DogCardService,
    public userService: UserService,
    public activeRoute: ActivatedRoute
  ) {
    this.mobile = window.screen.width <= 767;
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.dogId = params.id;
      this.dogService.getDog(this.dogId).add(()=> {
        this.mappedData = this.dogService.mapData(this.dogService.dogData);
        this.location = {lat: this.dogService.dogData.location.coordinates[1], lng: this.dogService.dogData.location.coordinates[0]};
        $('.tooltipped').tooltip({delay: 100});
        console.log('lcation', this.location);
      });
    });
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    $('.tooltipped').tooltip({delay: 100});
  }

}