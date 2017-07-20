import { Component} from '@angular/core';
export interface user {
  pic: string;
  name: {first: string, last1: string, last2: string};
  adress: {adressName: string, postalCode: string, city: string};
  contact: {lada: number, phone: number, email: string};
  access: {userName: string, password: string};
}
@Component({
  selector: 'account',
  template: require('./create-account.template.html'),
  styles: [ require('./account-style.scss')]
})
export class accountComponent {
  public accountpage: string;
  public user: user;
  constructor () {
    this.accountpage = 'Create your account here';
    this.user = {
      pic: './static/profile-undef.png' ,
      name: {first: undefined, last1: undefined, last2: undefined},
      adress: {adressName: undefined, postalCode: undefined, city: undefined},
      contact: {lada: undefined, phone: undefined, email: undefined},
      access: {userName: undefined, password: undefined}
    };
  }
  public createUser (): void {
    console.log('this', this);
  }

  public filePicChange(ev: any): void {
    const file: File = ev.target.files[0];
      if (file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
             this.user.pic = event.target.result;
          };
          reader.readAsDataURL(file);
        }catch (error){
          // do nothing
        }
      } else {
        console.error('not an image');
      }
  }

};
