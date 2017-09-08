import {Component, Input, ElementRef} from '@angular/core';

@Component({
  selector: 'text-scroll',
  template: require('./text-scroll.template.html'),
  styles: [ require('./text-scroll.scss')]
})
export class TextScrollComponent {
  public displayedText: any[];
  public positionCounter: number = 1;
  public maxIndex: number;
  public cancelScroll: boolean;
  public timeOutCancel: any;
  public pressedUp: boolean;
  public pressedDown: boolean;

  constructor(public el: ElementRef) {
    this.displayedText = [];
    for (let i = 2010; i < 2020; ++i) {
      this.displayedText.push(i);
    }
    this.maxIndex = this.displayedText.length - 1;
  }
  public ngAfterViewInit() {
    let hammertime = new Hammer(this.el.nativeElement);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL});
    console.log('hammertime', hammertime);
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
    ctrl.positionCounter = ctrl.positionCounter >= ctrl.maxIndex ? 0 : ctrl.positionCounter + 1;    
    animDuration = animDuration ? animDuration : 300;
    ctrl.pressedDown = true;
    setTimeout(() => {ctrl.pressedDown = false;}, animDuration);
  }

  public decrease(ctrl?: any, animDuration?: number): any {
    ctrl = ctrl ? ctrl : this;

    ctrl.positionCounter = ctrl.positionCounter <= 0 ?  ctrl.maxIndex : ctrl.positionCounter - 1;
    animDuration = animDuration ? animDuration : 300;
    ctrl.pressedUp = true;
    setTimeout(() => {ctrl.pressedUp = false;}, animDuration);
  }
}