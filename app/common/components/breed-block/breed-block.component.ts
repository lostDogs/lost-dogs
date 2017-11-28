import {Component, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import * as breedContent from '../../content/breeds.json';

@Component({
  selector: 'breed-block',
  template: require('./breed-block.template.html'),
  styles: [ require('./breed-block.scss')]
})

export class BreedBlockComponent { 
  public elements: any[];
  public neverAgain: boolean = true;
  public breeds: any = breedContent;
  public dogImgUrl: string = 'http://cdn.lostdog.mx/assets/img/dogs/';
  public maxSelection: number = 1;
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();  
  @Input()
  public removedElement: any;
  @Output()
  public changeTitle: EventEmitter<boolean> = new EventEmitter<boolean>();  
  constructor(public router: Router) {
    this.elements = [];
    this.breeds.forEach((value: any, valueIndex: number) => {
      // api val is adding the look alike,  and id value is the clean val.
    this.elements.push({name: value.name, imgUrl: this.dogImgUrl + value.id + '.jpg', apiVal: value.id, id: value.id});
    });
  }

  public ngOnInit(): void {
    const onPage: string = this.router.url.split('/')[1];
    if (onPage === 'lost') {
      this.elements.unshift({name: 'sin raza', imgUrl: this.dogImgUrl + 'noRace.jpg', apiVal: 0, id: 0 });
    } else  {
      this.elements.unshift({name: 'sin raza', imgUrl: this.dogImgUrl + 'mix.jpg', apiVal: 0, id: 0 });
    }
  }

  public ngAfterViewInit(): void {

  }

  public changeElement(event: any[]): void {
    const lastIndex: number = event.length && event.length - 1;
    const isIndexCero: boolean = event.length && event.some((val: any, valIndex: number) => {
      if (val.id === 0) {
        return true;
      }
    });
    console.log("ISINDEXCERO", isIndexCero);
    if (isIndexCero) {
        this.maxSelection = 3;
        if (this.router.url.split('/')[1] === 'lost') {
          this.changeTitle.emit(true);
        }
      }else {
        this.maxSelection = 1;
        if (this.router.url.split('/')[1] === 'lost') {
          this.changeTitle.emit(false);
        }
        if (event.length > 1) {
          event[lastIndex].disabled = false;
        }
      }
      const alike: string = event.length && this.findAlike(event[lastIndex].id);
      if (alike) {
        event[lastIndex].apiVal = event[lastIndex].id;
        event[lastIndex].apiVal += ' ' + alike;
        event[lastIndex].apiVal = event[lastIndex].apiVal && event[lastIndex].apiVal.trim().replace(/\s/g, ',');
      }

    const filteredEvents: any[] = event.length && event.filter((value: any, index: number)=>{return value.id});
    console.log('filtered events', filteredEvents);
    this.selectedEmitter.emit(filteredEvents);
  }

  public findAlike(id: string): string {
    const selectedBreed: any = this.breeds[+id - 1];
    return selectedBreed && selectedBreed.looksLike;
  }
}
