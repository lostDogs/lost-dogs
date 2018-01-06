import {Component, EventEmitter, Output, Input, ViewChild, ElementRef, Renderer, SimpleChanges} from '@angular/core';
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
  public forceSelection: number;

  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public removedElement: any;
  @Output()
  public changeTitle: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  public openBreedSearch: boolean;
  @Output()
  public openSearchemiter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('BreedSearcher')
  public breedSearchDom: ElementRef;
  @Input()
  public btnDom: ElementRef;

  constructor(public router: Router, public renderer: Renderer) {
    this.elements = [];
    this.breeds.forEach((value: any, valueIndex: number) => {
      // api val is adding the look alike,  and id value is the clean val.
    this.elements.push({name: value.name, imgUrl: this.dogImgUrl + value.id + '.jpg', apiVal: value.id, id: value.id});
    });
    this.renderer.listenGlobal('document', 'click', (event: any) => {
      if (this.openBreedSearch && this.breedSearchDom.nativeElement  && this.btnDom.nativeElement && !this.btnDom.nativeElement.contains(event.target) && !this.breedSearchDom.nativeElement.contains(event.target)) {
         this.openBreedSearch = false;
         this.openSearchemiter.emit(this.openBreedSearch);
      }
    });
  }

  public ngOnInit(): void {
    const onPage: string = this.router.url.split('/')[1];
    if (onPage === 'lost') {
      this.elements.unshift({name: 'sin raza', imgUrl: this.dogImgUrl + 'noRace.jpg', apiVal: 0, id: 0 });
    } else  {
      this.elements.unshift({name: 'mezcla', imgUrl: this.dogImgUrl + 'mix.jpg', apiVal: 0, id: 0 });
    }
  }

  public ngAfterViewInit(): void {
    const data: any = {};
    this.elements.forEach((val: any, valIndex: number) => {
      data[val.name] = val.imgUrl;
    });
    $(document).ready(() => {
      $('#breed-autocomp').autocomplete({
        data: data,
        limit: 10,
        onAutocomplete: (selectedName: string) => {
          const prevOffset: number = $('breed-block .scroll-section .row').offset().left;
          const screenWidth: number = document.documentElement.clientWidth;
          this.elements.some((val: any, valIndex: number) => {
            if (val.name.trim() === selectedName.trim()) {
              this.openBreedSearch = false;
              this.openSearchemiter.emit(this.openBreedSearch);
              this.forceSelection = valIndex;
              return true;
            }
          });
          if (this.forceSelection) {
            //to scroll frist need to find where we are at. <prevOffset>
            // then we need to figure if scroll left or right <left - prevOffset> the sign will take care.

            let left: number =  $('#' + this.elements[this.forceSelection].key).offset().left;
            if (prevOffset) {
               left = left - prevOffset;
            }
            $('breed-block .scroll-section').animate({ scrollLeft: left - screenWidth / 2 + 100}, 2000);
            setTimeout(() => {this.forceSelection = undefined}, 5);
          }
        },
        minLength: 1, 
      });
    });
  }

  public changeElement(event: any[]): void {
    if (!Array.isArray(event)) {
      event = [event];
    }
    const lastIndex: number = event.length && event.length - 1;
    const disabledElements: any[] = event.filter((value: any)=>{return value.disabled});
    const isIndexCero: boolean = event.length && event.some((val: any, valIndex: number) => {
      if (val.id === 0 && val.disabled) {
        return true;
      }
    });
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

        if (disabledElements.length > 1) {
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
      this.selectedEmitter.emit(filteredEvents);
  }

  public findAlike(id: string): string {
    const selectedBreed: any = this.breeds[+id - 1];
    return selectedBreed && selectedBreed.looksLike;
  }
}
