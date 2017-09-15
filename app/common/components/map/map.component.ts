import {Component, Output, Input, EventEmitter, ElementRef, ViewChild, SimpleChanges} from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'map',
  template: require('./map.template.html'),
  styles: [ require('./map.scss')]
})

export class MapComponent {
 @ViewChild('map') mapDiv: ElementRef;
 @ViewChild('range') range: ElementRef;
 public mapDef: google.maps.Map;
 public marker: google.maps.Marker;
 public geocoder: google.maps.Geocoder;
 public location: {lat: number, lng: number};
 @Input()
 public locationAdress: string;
 @Output()
 public question: EventEmitter<string> = new EventEmitter<string>();
 @Output()
 public locationAdressEmiter: EventEmitter<string> = new EventEmitter<string>();
 @Output()
 public inputFeildEmiter: EventEmitter<any> = new EventEmitter<any>();

public rangeTop: string;
public rangeLeft: string;
public custom: string;

  constructor(public el: ElementRef, public userService: UserService) {
  }

  public centerRange(): void {
    const mapWidth: number = this.mapDiv.nativeElement.offsetWidth ? this.mapDiv.nativeElement.offsetWidth  : window.screen.width;
    const mapHeigh: number = this.mapDiv.nativeElement.offsetHeight ? this.mapDiv.nativeElement.offsetHeight : 400;
    this.rangeLeft = (mapWidth - this.range.nativeElement.offsetWidth) / 2 + 'px';
    this.rangeTop = ((mapHeigh -this.range.nativeElement.offsetHeight) / 2  - 10) + 'px';
  }

  public ngOnInit(): void {
    this.inputFeildEmiter.emit({type:'address', label:''});
    this.question.emit('Donde lo perdiste?');
  }

  public ngAfterViewInit(): void {
    let initlocation: any;
    this.userService.getUserLocation().then(
      (sucess) => {this.initMap(sucess)},
      (error) => {this.initMap()}
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.locationAdress && changes.locationAdress.currentValue) {
      const formatedAddress: string = changes.locationAdress.currentValue;
      this.getLatLng(formatedAddress, this);
    }
  }


  public initMap (userLocation?: {lat: number, lng:number}): void {
    const ctrl = this;
    this.mapDef = new google.maps.Map(this.mapDiv.nativeElement, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10,
      streetViewControl: false,
    });
    this.geocoder = new google.maps.Geocoder;
    // click linseter
    this.mapDef.addListener('click', (event: any) => {
      ctrl.addMarker(event.latLng, ctrl.mapDef, ctrl);
       ctrl.location = event.latLng;
       ctrl.getFormatedAdress( ctrl.location, ctrl);
      // ctrl.rangeLeft = event.pixel.x- ctrl.range.nativeElement.offsetWidth / 2 + 'px';
      // ctrl.rangeTop = event.pixel.y - ctrl.range.nativeElement.offsetHeight /2 + 'px';
    });
    //initial location if user permits
    if (userLocation) {
       this.addMarker(userLocation, this.mapDef, ctrl, {animation: google.maps.Animation.DROP});
       this.mapDef.panTo(userLocation);
       this.getFormatedAdress(userLocation, this);
       this.location = userLocation;
       this.mapDef.setZoom(15);
       // this.centerRange();
    }
  }

  public getFormatedAdress(location: {lat: number, lng:number} ,ctrl?: any): void {
    ctrl = ctrl ? ctrl : this;
    ctrl.geocoder.geocode({location: location}, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[1]) {
          ctrl.locationAdress = results[1].formatted_address;
          ctrl.locationAdressEmiter.emit(ctrl.locationAdress);
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
      ctrl.custom.remove();
    }
     if (typeof location.lat === 'function') {
      location = {lat: location.lat(), lng: location.lng()};
    }
    console.log('lat origin:',location.lat);
    console.log('long origin:',location.lng);
    ctrl.marker = new google.maps.Marker(markerConf);
   ctrl.custom = new CustomMarker(location, map);
  }
}


export class CustomMarker extends google.maps.OverlayView {
  public latlngMin: google.maps.LatLng;
  public latlngMax: google.maps.LatLng;
  public map: google.maps.Map;
  public div: any;
  // distance in km wich is diamter
  public distance: number = 1;
  public earthRadius: number = 6371;
  public bounds: google.maps.LatLngBounds;

  constructor(latlng: {lat: any, lng: any}, map: google.maps.Map) {
    super();
    if (typeof latlng.lat === 'function') {
      latlng = {lat: latlng.lat(), lng: latlng.lng()};
    }
    
    const r = this.distance/this.earthRadius
    const latmin = this.radToDeg(this.degToRad(latlng.lat) - r);
    const latmax = this.radToDeg(this.degToRad(latlng.lat) + r);
    const deltlng = this.radToDeg(Math.asin(Math.sin(r) / Math.cos(this.degToRad(latlng.lng))));
    const lngmin = latlng.lng - deltlng;
    const lngmax = latlng.lng + deltlng;
    this.latlngMin =  new google.maps.LatLng(latmin, lngmin);
    this.latlngMax = new google.maps.LatLng(latmax, lngmax);
    this.bounds =  new google.maps.LatLngBounds(
      new google.maps.LatLng(latmin, lngmin),
      new google.maps.LatLng(latmax, lngmax));
    console.log('lat', latlng.lat);
    console.log('lng', latlng.lng);
    console.log('r', r)
    console.log('lat rad', this.degToRad(latlng.lat));
    console.log('latmin', latmin);
    console.log('lngmin', lngmin);
    console.log('latmax', latmax);
    console.log('lngmax', lngmax);
    this.setMap(map);
  }
  public draw() {
    const me: any = this;
    let div = this.div;
    const sw = this.getProjection().fromLatLngToDivPixel(this.bounds.getSouthWest());
    const ne = this.getProjection().fromLatLngToDivPixel(this.bounds.getNorthEast());    
    // const point = this.getProjection().fromLatLngToDivPixel(this.latlngMin);
    // const point2 = this.getProjection().fromLatLngToDivPixel(this.latlngMax);
    if (!div) {
      div = this.div = document.createElement('div');
      div.style.color = '#ff1744';
      div.className = 'range sonar sonar-infinite sonar-stroke';
      google.maps.event.addDomListener(div, 'click', (event: any) => {
          google.maps.event.trigger(me, 'click');
      });
      const panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }
    if (sw && ne) {
      div.style.left = sw.x - (sw.y - ne.y)*2.5 + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = sw.y - ne.y + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
    }
    console.log('div', this.div);
  }

  public remove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
    }    
  }
  public degToRad (deg: number): number {
    return (Math.PI * deg) / 180;
  }
  public radToDeg(rad: number): number {
    return (rad * 180) / Math.PI ;
  }
}
