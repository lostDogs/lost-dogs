import {Component, EventEmitter, Output, Input} from '@angular/core';
import {DogCardService} from '../../services/dog-card.service';

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
  public colors: string[] = ['#ef6b13', '#DFA96D'];
  constructor(public dogCard: DogCardService) {
  }
  
  public ngOnInit(): void {
    let els: any[] = [];
    this.dogCard.patterns.forEach((value: string, index: number) => {
      els.push({name: value});
    });
    this.elements = els;
  }

  public changeElement(event: any): void {
    this.selectedEmitter.emit(event);
  }
  public colorSelection(event: any): void {
  }
}
