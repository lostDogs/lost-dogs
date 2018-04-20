import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';
const imgCompress = require('@xkeshi/image-compressor');
@Component({
  selector: 'pic-details',
  template: require('./pic-details.template.html'),
  styles: [ require('./pic-details.scss')]
})

export class DetailsComponent { 
  public errorImg: string;
  public clearComments: boolean;
  public hideReward: boolean;

  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = 'sube una foto de tu mascota';
    this.LostService.question3 = 'añade un cometario extra';
    this.LostService.question = 'ponle una recompensa';
    this.LostService.optional = false;
    this.LostService.multipleImgAnswers = undefined;
    this.LostService.inputField = {type: 'binary', label: 'dogPicture'};
  }
  
  public ngOnInit(): void {
  }
 
  public ngAfterViewInit(): void {
    $('#money-input').mask('000,000.00', {reverse: true});
    this.hideReward = this.LostService.parentPage !== 'lost';
    if (this.hideReward) {
      this.LostService.question = undefined;
    }
  }

  public filePicChange(ev: any): void {
    let file: File = ev.target.files[0];
    console.log('ev', ev);
     if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          this.minifyImgFile(file).then(miniFile => {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.LostService.dogPicture = event.target.result;
              this.errorImg = undefined;
              this.LostService.setAnwer();
            };
            reader.readAsDataURL(miniFile);
          });
        }catch (error) {
          // do nothing
        }
      } else {
        this.LostService.dogPicture = this.LostService.defaultDogPic;
        this.errorImg = 'No es una image.';
        console.error('not an image');
      }    
  }

  public minifyImgFile(file: File): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      new imgCompress(file, {
        quality: .8,
        maxWidth: 650,
         success(result: any) {
          console.log('reducing file zise quality: 0.6 width: 150px', result);
          resolve(result);
         },
          error(error: any) {
            reject(error);
          }
      });
    });
  }

  public setFocusOnMoney(): void {
    this.LostService.reward = this.LostService.reward === this.LostService.defaultReward ? '' : this.LostService.reward;
    $('#money-input').focus();
  }

  public clearInput(): void {
    this.LostService.reward = this.LostService.reward === '' ? this.LostService.defaultReward : this.LostService.reward;
  }

  public setFocusOnComments(): void {
    this.clearComments = true;
    $('#textarea1').focus(); 
  }
}
