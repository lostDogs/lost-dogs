import {Component} from '@angular/core';
import {LostFoundService} from '../../../common/services/lost-found.service';

@Component({
  selector: 'pic-details',
  template: require('./pic-details.template.html'),
  styles: [ require('./pic-details.scss')]
})

export class DetailsComponent { 
  public errorImg: string;
  public clearComments: boolean;

  constructor(public LostService: LostFoundService) {
    this.LostService.question2 = 'sube una foto del perro';
    this.LostService.question3 = 'aniade un cometario extra';
    this.LostService.question = 'ponle una recompenza';
    this.LostService.optional = false;
    this.LostService.multipleImgAnswers = undefined;
    this.LostService.inputField = {type: 'binary', label: 'dogPicture'};
  }
  
  public ngOnInit(): void {
  }
 
public ngAfterViewInit(): void {
  $('#money-input').mask('000,000.00', {reverse: true});
}
  public filePicChange(ev: any): void {
    const file: File = ev.target.files[0];
    this.LostService.binaryDogImg = file;
     if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          if (file.size > 3 * 1024 * 1024) {
            this.minifyImgFile(file);
          }
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.LostService.dogPicture = event.target.result;
            this.errorImg = undefined;
          };
          reader.readAsDataURL(file);
        }catch (error) {
          // do nothing
        }
      } else {
        this.LostService.dogPicture = this.LostService.defaultDogPic;
        this.errorImg = 'No es una image.';
        console.error('not an image');
      }    
  }

  public minifyImgFile(file: File) {
    const imgCompress = require('@xkeshi/image-compressor');
    const self:DetailsComponent = this;
    new imgCompress(file, {
      quality: .8,
       success(result: any) {
        console.log('reducing file zise', result);
        self.LostService.binaryDogImg = result;
       }
    })
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
