import {Component, Output, Input, EventEmitter, SimpleChanges} from '@angular/core';
import {DogCardService} from '../../services/dog-card.service';

@Component({
  selector: 'dog-figure',
  template: require('./dog-figure.template.html'),
  styles: [ require('./dog-figure.scss')]
})

export class DogFigureComponent {
 public partLabels: {[dogPart: string]: {label: string, visible: boolean}};
 @Input()
 public display: string;
 @Input()
 public indexed: number;
 @Output()
 public dogClicked: EventEmitter<any> = new EventEmitter<any>();
  constructor(public dogCard: DogCardService)  {
    this.partLabels = {
      'back-color': {label: 'Plano', visible: true},
      'face-dog': {label: 'Cara', visible: false},
      'right-ear-dog': {label: 'Oreja izquerda', visible: false},
      'left-ear-dog': {label: 'Oreja derecha' , visible: false},
      'back-dog': {label: 'Espalda' , visible: false},
      'huge-dots-dog': {label: 'Manchas grandes' , visible: false},
      'chest-dog': {label: 'Pecho', visible: false},
      'tuxedo-dog': {label: 'Esmoquin' , visible: false},
      'small-dots-dog': {label: 'Manchas pequenias' , visible: false},
      'front-legs-dog': {label: 'Piernas delanteras' , visible: false},
      'back-legs-dog': {label: 'Piernas traceras' , visible: false},
      'paws-dog': {label: 'Patas' , visible: false},
      'tigger-dog': {label: 'Tigre' , visible: false}
    };
    this.dogCard.patterns = Object.keys(this.partLabels);
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.display && changes.display.currentValue) {
      const partsDisplay: string[] = Array.isArray(changes.display.currentValue) ? changes.display.currentValue : changes.display.currentValue.split(' ');
      if (partsDisplay.length > 1) {
        partsDisplay.forEach((value: string, valueIndex: number) => {
          // when adding color into the name will be name:#A124de;
          const splittedValue: string = value.split(':')[0];
          if (this.partLabels[splittedValue]) {
            this.partLabels[splittedValue].visible = true;
          }
        });
      } else if (this.partLabels[this.display]) {
        this.partLabels[this.display].visible = true;
      }
    }
  }

  public dogclicked() {
    this.dogClicked.emit(this.indexed);
  }

}
