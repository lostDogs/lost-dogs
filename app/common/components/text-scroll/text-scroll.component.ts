import {Component, Input, ElementRef, Output, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'text-scroll',
  template: require('./text-scroll.template.html'),
  styles: [ require('./text-scroll.scss')]
})
export class TextScrollComponent {
  @Input('content')
  public displayedText: any[];
  @Input()
  public init: any;
  @Input('selected')
  public positionCounter: number;
  public maxIndex: number;
  public cancelScroll: boolean;
  public timeOutCancel: any;
  public pressedUp: boolean;
  public pressedDown: boolean;
  @Output('selected')
  public positionCounterChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(public el: ElementRef) {
    if (!this.displayedText) {
      this.displayedText = [];
      for (let i = 0; i < 5; ++i) {
        this.displayedText.push('no content');
      }
    }
  }

  public ngOnInit(): void {
    const indexInit = this.displayedText.indexOf(this.init);
    this.positionCounter = indexInit !== -1 ?  indexInit : this.init;
    this.maxIndex = this.displayedText.length - 1;
    //
    this.positionCounterChange.emit(this.positionCounter);
  }

  public ngAfterViewInit() {
    let hammertime = new Hammer(this.el.nativeElement);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL});
    hammertime.on("swipeup", (ev: any) => {
      console.log('swip up', ev);
      this.cancelScroll = false;
      this.speeedEfect(Math.abs(ev['velocityY']), this.increse);
    });
    hammertime.on("swipedown", (ev: any) => {
      console.log('swip down',  ev);
      this.cancelScroll = false;
      this.speeedEfect(ev['velocityY'], this.decrease);
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.displayedText) {
      this.maxIndex = this.displayedText.length - 1;
    }
  }

  public speeedEfect (velocity: number, action: (ctrl?: any, animDuration?: number)=> void) {
      console.log('swip speed', velocity);
      // 500 => Fixed distance
      let time: number = 500 / velocity;
      for ( let i: number = 0; i < velocity; i++) {
        console.log('time', time);
        // 0.5 => Deceleration factor
        time = time + time * 0.5;
        if (time >= 2500) {
          // Maximun time to be 2.5s. You wouldn't like to wait more...
          console.log('time exceding 2.5s');
          break;
        } else if (this.cancelScroll) {
          clearTimeout(this.timeOutCancel);
          break;
        }
        this.timeOutCancel = setTimeout(() => { action(this, time)}, time);
      }    
  }

  public before(): any {
    if (this.positionCounter === 0) {
      return this.displayedText[this.maxIndex];
    }
    return this.displayedText[this.positionCounter - 1];
  }

  public after(): any {
    if (this.positionCounter === this.maxIndex) {
      return this.displayedText[0];
    }
    return this.displayedText[this.positionCounter + 1];
  }

  public increse(ctrl?: any, animDuration?: number): any {
    ctrl = ctrl ? ctrl : this;
    animDuration = animDuration ? animDuration : 300;
    ctrl.pressedDown = true;
    ctrl.positionCounter = ctrl.positionCounter >= ctrl.maxIndex ? 0 : ctrl.positionCounter + 1;    
    //
    ctrl.positionCounterChange.emit(ctrl.positionCounter);
    setTimeout(() => {ctrl.pressedDown = false;}, animDuration);
  }

  public decrease(ctrl?: any, animDuration?: number): any {
    ctrl = ctrl ? ctrl : this;
    animDuration = animDuration ? animDuration : 300;
    ctrl.pressedUp = true;
    ctrl.positionCounter = ctrl.positionCounter <= 0 ?  ctrl.maxIndex : ctrl.positionCounter - 1;
    //
    ctrl.positionCounterChange.emit(ctrl.positionCounter);
    setTimeout(() => {ctrl.pressedUp = false;}, animDuration);
  }

}