import {Component, Output, Input, EventEmitter, ElementRef, ViewChild, SimpleChanges} from '@angular/core';
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
public custom: CustomMarker;
 @Input()
 public location: {lat: number, lng: number};
 @Output()
 public locationEmiter: EventEmitter<any> = new EventEmitter<any>();
 @Input()
 public locationAdress: string;
 @Output()
 public locationAdressEmiter: EventEmitter<string> = new EventEmitter<string>();
 @Input()
 public rangeRadius: number;
 @Input()
 public dogPage: boolean;

  constructor(public el: ElementRef, public userService: UserService) {}

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    console.log('this location', this.location);
    if (!this.dogPage) {
      this.userService.getUserLocation().then(
        (sucess) => {this.initMap(sucess)},
        (error) => {
          this.initMap(error);
          this.mapDef.setZoom(13);
        });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.locationAdress && changes.locationAdress.currentValue) {
      const formatedAddress: string = changes.locationAdress.currentValue;
      this.getLatLng(formatedAddress, this);
      this.mapDef.setZoom(this.getZoomFromRange(this.rangeRadius));
    }else if (changes.rangeRadius && changes.rangeRadius.currentValue && this.custom) {
        const range: number = changes.rangeRadius.currentValue;
        this.custom.remove();
        this.custom = new CustomMarker(this.location, this.mapDef, range);
        const zoom: number = this.getZoomFromRange(range);
        this.mapDef.panTo(this.location);
        this.mapDef.setZoom(zoom);
    }else if (changes.location && changes.location.currentValue && this.dogPage) {
      this.initMap(changes.location.currentValue);
    }
  }

  public initMap (userLocation?: {lat: number, lng:number}): void {
    const ctrl = this;
    this.mapDef = new google.maps.Map(this.mapDiv.nativeElement, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false
    });

    this.geocoder = new google.maps.Geocoder();
    // click linseter
    this.mapDef.addListener('click', (event: any) => {
      ctrl.addMarker(event.latLng, ctrl.mapDef, ctrl);
      ctrl.location = typeof event.latLng.lat === 'function' ? {lat: event.latLng.lat(), lng: event.latLng.lng()} : event.latLng;
       ctrl.locationEmiter.emit(ctrl.location);
       ctrl.getFormatedAdress( ctrl.location, ctrl);
    });
    //initial location if user permits
    if (userLocation && !this.location) {
       this.addMarker(userLocation, this.mapDef, ctrl, {animation: google.maps.Animation.DROP});
       this.mapDef.panTo(userLocation);
       this.getFormatedAdress(userLocation, this);
       this.location = userLocation;
       ctrl.locationEmiter.emit(ctrl.location);
       this.mapDef.setZoom(15);
    } else if (this.location) {
      this.addMarker(this.location, this.mapDef, ctrl, {animation: google.maps.Animation.DROP});
      this.mapDef.panTo(this.location);
      this.mapDef.setZoom(this.getZoomFromRange(this.rangeRadius));
    }
    $('document').ready(() => {
      if (google && google.maps) {
        google.maps.event.trigger(this.mapDef, 'resize');
        this.location && this.mapDef.panTo(this.location);
      }
    });
  }

  public getZoomFromRange(range: number): number {
    switch (range) {
      case 0.5:
        return 15;
      case 1:
        return 14;
      case 2:
        return 12;
      case 3:
        return 12;
      case 4:
        return 11;
      default:
        return 15;
    }
  }

  public getFormatedAdress(location: {lat: number, lng:number} ,ctrl?: any): void {
    ctrl = ctrl ? ctrl : this;
    ctrl.locationAdress = 'Cargando ...';
    ctrl.locationAdressEmiter.emit(ctrl.locationAdress);
    ctrl.geocoder.geocode({location: location}, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[1]) {
          ctrl.locationAdress = results[1].formatted_address;
          ctrl.locationAdressEmiter.emit(ctrl.locationAdress);
        }
      }else {
        ctrl.locationAdress = 'no se encontro ubicación';
        ctrl.locationAdressEmiter.emit(ctrl.locationAdress);
      }
    });
  }

  public getLatLng(formatedAddresss: string, ctrl: any): void {
    ctrl = ctrl ? ctrl : this;
    ctrl.geocoder && ctrl.geocoder.geocode({address: formatedAddresss}, (results: any, status: any) => {
      if (status === 'OK') {
        ctrl.location = results[0].geometry.location;
        ctrl.location = typeof ctrl.location.lat === 'function' ? {lat: ctrl.location.lat(), lng: ctrl.location.lng()} : ctrl.location;
        ctrl.locationEmiter.emit(ctrl.location);
        ctrl.locationAdressEmiter.emit(formatedAddresss);
        ctrl.addMarker(ctrl.location, ctrl.mapDef, ctrl, {animation: google.maps.Animation.DROP});
        ctrl.mapDef.panTo(ctrl.location);
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
    ctrl.marker = new google.maps.Marker(markerConf);
    if (ctrl.rangeRadius) {
      ctrl.custom = new CustomMarker(location, map, ctrl.rangeRadius);
    } else {
      ctrl.custom = new CustomMarker(location, map);
    }
  }
}

export class CustomMarker extends google.maps.OverlayView {
  public latlngMin: google.maps.LatLng;
  public latlngMax: google.maps.LatLng;
  public latlng: google.maps.LatLng;
  public map: google.maps.Map;
  public div: any;
  // distance in km wich is radius
  public distance: number = 0.5;
  public earthRadius: number = 6371;

  constructor(latlng: {lat: any, lng: any}, map: google.maps.Map, range?: number) {
    super();
    this.distance = range || this.distance;
    if (typeof latlng.lat === 'function') {
      latlng = {lat: latlng.lat(), lng: latlng.lng()};
    }
    // Formulas from http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates#SphereRadiusc
    const r = this.distance / this.earthRadius;
    const latmin = this.radToDeg(this.degToRad(latlng.lat) - r);
    const latmax = this.radToDeg(this.degToRad(latlng.lat) + r);
    const deltlng = this.radToDeg(Math.asin(Math.sin(r) / Math.cos(this.degToRad(latlng.lng))));
    const lngmin = latlng.lng - deltlng;
    const lngmax = latlng.lng + deltlng;
    this.latlng = new google.maps.LatLng(latlng.lat, latlng.lng);
    this.latlngMin =  new google.maps.LatLng(latmin, lngmin);
    this.latlngMax = new google.maps.LatLng(latmax, lngmax);
    this.setMap(map);
  }

  public draw() {
    const me: any = this;
    let div = this.div;
    const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    const pointMin = this.getProjection().fromLatLngToDivPixel(this.latlngMin);
    const pointMax = this.getProjection().fromLatLngToDivPixel(this.latlngMax);
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

    if(pointMin && pointMax) {
      const disTwoPoint = Math.sqrt(Math.pow(pointMax.x - pointMin.x, 2) + Math.pow(pointMax.y - pointMin.y, 2)) / 2;
      // generating the top pixel is the max + 25% of its width
      div.style.top = pointMax.y - Math.round(disTwoPoint / 4)  + 'px';
      // for the left when need to not the 25% but the 50% of its width
      div.style.left = pointMax.x + Math.round(disTwoPoint / 2) + 'px';
      div.style.width = disTwoPoint + 'px';
      div.style.height = disTwoPoint + 'px';
    }
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
    return (rad * 180) / Math.PI;
  }
}