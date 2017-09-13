import {Component, Output, Input, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'map',
  template: require('./map.template.html'),
  styles: [ require('./map.scss')]
})

export class MapComponent {
 @ViewChild('map') mapDiv: ElementRef;
 public mapDef: google.maps.Map;
 public marker: google.maps.Marker;
 public geocoder: google.maps.Geocoder;
 public location: {lat: number, lng: number};
 public locationAdress: string;

  constructor(public el: ElementRef, public userService: UserService) {}

  public ngAfterViewInit(): void {
    let initlocation: any;
    this.userService.getUserLocation().then(
      (sucess) => {this.initMap(sucess)},
      (error) => {this.initMap()}
    );
  }

  public initMap (userLocation?: {lat: number, lng:number}): void {
    const ctrl = this;
    this.mapDef = new google.maps.Map(this.mapDiv.nativeElement, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10
    });
    this.geocoder = new google.maps.Geocoder;
    this.mapDef.addListener('click', function(event: any) {
      ctrl.addMarker(event.latLng, ctrl.mapDef, ctrl);
       ctrl.location = event.latLng;
       ctrl.getFormatedAdress( ctrl.location, ctrl);
    });
    if (userLocation) {
       this.addMarker(userLocation, this.mapDef, ctrl, {animation: google.maps.Animation.DROP});
       this.mapDef.panTo(userLocation);
       this.location = userLocation;
       this.mapDef.setZoom(15);
    }
  }

  public getFormatedAdress(location: {lat: number, lng:number} ,ctrl?: any): void {
    ctrl = ctrl ? ctrl : this;
    ctrl.geocoder.geocode({location: location}, (results: any, status: any) => {
      if (status === 'OK') {
        console.log('results', results);
        if (results[1]) {
          ctrl.locationAdress = results[1].formatted_address;
        }
      }else {
        console.error('geocoder failed due to ', status);
      }
    });
  }

  public getLatLng(formatedAddresss: string, ctrl: any): void {
    ctrl = ctrl ? ctrl : this;
    ctrl.geocoder.geocode({address: formatedAddresss}, (results: any, status: any) => {
      if (status === 'OK') {
        ctrl.location = results[0].geometry.location;
        ctrl.addMarker(ctrl.location, ctrl.mapDef, ctrl, {animation: google.maps.Animation.DROP});
        ctrl.mapDef.panTo(ctrl.location);
        ctrl.mapDef.setZoom(15);
      }
    });
  }

  public addMarker(location: any, map: google.maps.Map, ctrl: any, markerOpts?: Object): void {
    let markerConf: any = {
      position: location,
      map: map
    };
    // merge both configurations
    if (markerOpts) {
      Object.assign(markerConf, markerOpts);
    }
    //erease previous marker so that we can only have one.
    if (ctrl.marker) {
      ctrl.marker.setMap(null);
    }
    ctrl.marker = new google.maps.Marker(markerConf);
  }
}
