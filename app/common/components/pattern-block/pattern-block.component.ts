import {Component, EventEmitter, Output, Input} from '@angular/core';
import {DogCardService} from '../../services/dog-card.service';
import * as colors from '../../content/colors.json';

@Component({
  selector: 'pattern-block',
  template: require('./pattern-block.template.html'),
  styles: [ require('./pattern-block.scss')]
})

export class PatternBlockComponent { 
  public elements: any[];
  @Output()
  public selectedEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  public removedElement: any;
  public removedColor: any;
  @Input()
  public colors: string[];
  public colorNames: string[] = [];
  public colorValues: string[] = [];
  constructor(public dogCard: DogCardService) {
 
  }
  
  public ngOnInit(): void {
    let els: any[] = [];
    Object.keys(this.dogCard.patterns).forEach((value: string, index: number) => {
      els.push({name: value, label: this.dogCard.patterns[value].label});
    });
    this.elements = els;
    if (colors) {
      this.colorNames = Object.keys(colors);
      this.colorValues = Object.values(colors);
    }
  }

  public changeElement(event: any): void {
    if (Array.isArray(event) && event.length) {
      const matching: string[]  = event[event.length - 1].label.match(/: ([^\s]+)/g);
      const coloring = matching && matching.length ? this.colorValues.indexOf(matching[0].replace(/: /, '')) :  -1;
      if (~coloring) {
        event[event.length - 1].label = event[event.length - 1].label.replace(/: ([^\s]+)/g, ': '+ this.colorNames[coloring]);
      }
    }
    this.selectedEmitter.emit(event);
  }
}
