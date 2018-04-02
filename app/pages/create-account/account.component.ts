import { Component, Input, ElementRef, ViewChild, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import * as countryData from '../../common/content/countries.json';
import {ValidationService} from  '../../common/services/validation.service';
import {ApiService} from '../../common/services/api.service';
import {UserService} from '../../common/services/user.service';
import {GlobalFunctionService} from '../../common/services/global-function.service';

require('../../common/plugins/masks.js');
const imgCompress = require('@xkeshi/image-compressor');

export interface formObj {
  valid: boolean;
  value: any;
  required: boolean;
  label?: string;
}

export interface Iuser {
  pic: formObj;
  name: {first: formObj, last1: formObj, last2: formObj};
  adress: {adressName: formObj, postalCode: formObj, city: formObj, numberExt: formObj, numberInt: formObj, country: formObj, street: formObj};
  contact: {phone: formObj, email: formObj};
  access: {password: formObj, password2: formObj};
}

@Component({
  selector: 'account',
  template: require('./create-account.template.html'),
  styles: [ require('./account-style.scss')]
})
export class accountComponent {
  @Input()
  public user: Iuser;
  public countries: any;
  public binaryImg: any;
  public loading: boolean;
  public loadingTextField: string = 'Cargando...';
  @Input()
  public title: string = 'Crea tu cuenta';
  @Input()
  public profilePage: boolean;
  public atCreateAccount: boolean;
  @Input()
  public orginalUser: Iuser;
  @Input()
  public disableButton: (userBlock: any, originalUserBlock: any) => void;
  @Input()
  public hoverRetainState: () => void;
  public state: string;
  //only used in profile/edit
  public oldPassword: string;
  @ViewChild('Addresss')
  public addressDom: ElementRef;
  
  @Input()
  public checkingMissingFields: boolean;
  @Input()
  public missingFields: any;
  @Input()
  public fbUser: any;
  //every change is the following output variablewill export the this.user  out
  @Input()
  public creatingUser: boolean;
  @Output()
  public userCreated: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public disableBtn: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor (public validate: ValidationService, public api: ApiService, public router: Router, public userService: UserService, public globalService: GlobalFunctionService) {
    this.countries = [{"id": "MX", "name": "Mexico"}];
    // define the user object before
    this.atCreateAccount = /account/g.test(window.location.href);
    this.user = {
      pic: {value:'https://www.lostdog.mx/assets/img/profile-undef.png', valid: true, required: true, label: 'Imagen de perfil'},
      name: {
        first: {valid: true, value: undefined, required: true, label: 'Nombre'},
        last1: {valid: true, value: undefined, required: true, label: 'Apellido paterno'},
        last2: {valid: true, value: undefined, required: true, label: 'Apellido materno'}
      },
      adress: {
        adressName: {valid: true, value: undefined, required: false, label: 'Colonia'},
        postalCode: {valid: true, value: undefined, required: false, label: 'Código Postal'},
        city: {valid: true, value: undefined, required: false, label: 'Ciudad'},
        numberExt: {valid: true, value: undefined, required: false, label: 'Número exterior'},
        numberInt: {valid: true, value: undefined, required: false, label: 'Número interior'},
        country: {valid: true, value: undefined, required: false, label: 'País'},
        street: {valid: true, value: undefined, required: false, label: 'Calle'}
      },
      contact: {
        phone: {valid: true, value: undefined, required: true, label: 'Teléfono celular'},
        email: {valid: true, value: undefined, required: true, label: 'Correo electrónico'}
      },
      access: {
        password: {valid: true, value: undefined, required: true, label: 'Contraseña'},
        password2: {valid: true, value: undefined, required: true, label: 'Repetir contraseña'}
      }
    };
    //Catptcha code incliding the ngOnDestroy.
    if (!this.checkingMissingFields) {
      window['captchaSubmit'] = this.userService.captchaSubmit.bind(this.userService);
      window['expiredCaptcha'] = this.userService.expiredCaptcha.bind(this.userService);
      window['onloadCallback'] = this.userService.onloadCallback;
      this.userService.loadCaptchaScript();
    }
  }

  public ngAfterViewInit(): void {
   $('select').material_select();
   $('#phone').mask('0000000000');
   if (this.hoverRetainState)  {
     this.hoverRetainState();
   }
    $('select').change(() => {
      const input = $('#country');
      this.user.adress.country.value = input.val();
      this.user.adress.country.valid = true;
      this.disableIfmf();
    });   
   if (this.profilePage && this.userService.user.address.country) {
      $('#country option[value=' + this.userService.user.address.country + ']').attr('selected','selected');
      $('#country').change();
      // executing change and the make it visaully appear on the dropbox by add the val with Jquery
      $('input[type=text].select-dropdown').val(this.userService.user.address.country);
   }
  }

  public ngOnInit(): void {
    if (this.userService.isAuth && !this.profilePage &&!this.checkingMissingFields) {
      this.router.navigate(['/profile']);
    }
    this.user.adress.country.value = undefined;
  }

  public createUser (form?: any): void {
    this.globalService.clearErroMessages();
    this.userService.isAvatarSet = undefined;
    // Check for undefined and set formvalue to false
    console.log('Form with cpatcha', form);
    let validForm: boolean = true;
    const userFirts: any[] = Object.keys(this.user);
    userFirts.forEach((userKey: any, elementIndex: number) => {
      const element: any = this.user[userKey];
      const propKey: any = Object.keys(element);
      if (element instanceof Object && element[propKey[0]] instanceof Object) {
        for (let i = 0; i < propKey.length; i++) {
          const content: string = element[propKey[i]].value;
          if (element[propKey[i]].required && !content) {
            element[propKey[i]].valid = false;
            validForm = false;
          }
          if (!element[propKey[i]].valid) {
            validForm = false;
            const fieldName = element[propKey[i]].label ? element[propKey[i]].label : propKey[i];
            this.globalService.setErrorMEssage(fieldName +' invalido');
            break;
          }
        }
      } else {
        const fieldName = element.label ? element.label : userKey;
        if (element.required && (!element.value || element.value === 'https://www.lostdog.mx/assets/img/profile-undef.png' ) ) {
          element.valid = false;
          validForm = false;
          this.globalService.setErrorMEssage(fieldName +' requerido');
        } else if (!element.valid) {
          validForm = false;
          this.globalService.setErrorMEssage(fieldName +' invalido');
        }
      }
    });
    if (validForm && (this.userService.validCaptcha || /profile\/edit/g.test(this.router.url))) {
      if (/profile\/edit/g.test(this.router.url)) {
        this.postUser().add(() => {
          // if its is allready in db
          if (!this.userService.userNotInDb) {
            this.globalService.clearErroMessages();
            this.globalService.setErrorMEssage('Se han agregado tus datos');
            this.globalService.openBlueModal();
            this.router.navigate(['/profile/main']);
          }
        });
      } else {
        this.postUser();
      }
    } else {
      this.userService.isAvatarSet = this.userService.user.fbId;
      if (!this.userService.validCaptcha && validForm) {
        this.globalService.setErrorMEssage('Parece que eres un robot');
        this.globalService.setSubErrorMessage('error en re-captcha');
      }
      this.globalService.openErrorModal();
    }
  }

  public filePicChange(ev: any): void {
    const file: File = ev.target.files[0];
      if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          this.minifyImgFile(file).then(miniFile => {
          this.binaryImg = miniFile;
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.user.pic.value = event.target.result;
              this.user.pic.valid = true;
              this.disableIfmf();
            };
            reader.readAsDataURL(miniFile);
          });
        }catch (error) {
          // do nothing
        }
      } else {
        this.user.pic.valid = false;
        this.user.pic.value = 'https://www.lostdog.mx/assets/img/profile-undef.png';
        console.error('not an image');
      }
  }

 public errorImgToBucket (e: any): void {
   this.globalService.clearErroMessages();
   this.globalService.setErrorMEssage('No pudimos agregar tu image de perfil');
   this.globalService.setSubErrorMessage('intenta mas tarde en mi perfil');
   this.globalService.openErrorModal();
   console.error('error setting img', e);
 }

  public setImgToBucket(url: string): void {
    console.log('setting img to bucket > ', url);
    this.api.put(url, this.binaryImg, {'Content-Type': 'image/jpeg', 'Content-encoding': 'base64'}).subscribe(
      data => this.sucessImgToBucket(data),
      e => this.errorImgToBucket(e),
      ()=> { this.atCreateAccount && this.toHomePage(); }
      );
  }

  public sucessImgToBucket(data?: any): void {
    setTimeout(() => {this.userService.isAvatarSet = true;}, 4000);
  }

  public toHomePage(): void {
    this.loading = false;
    this.router.navigate(['/home'], {queryParams:{nU: true}});
    window.scroll(0,0);
  }

  public afterCreateData(data: any): void {
    this.userService.userNotInDb = false;
    if (data.uploadAvatarUrl) {
      this.setImgToBucket(data.uploadAvatarUrl);
    } else {
      this.sucessImgToBucket();
    }
    this.userService.setUser(data);
  }

  public afterCreateError(e: any): void {
    let errorMessage: string = this.globalService.parseJsonError(e);
    this.globalService.setErrorMEssage(errorMessage);
    this.globalService.openErrorModal();
    this.loading = false;
    this.userService.isAvatarSet = !!this.userService.user.fbId;
  }

  public userBuilder(user: Iuser): any {
    const userPost: any = {
      'name': user.name.first.value,
      'surname':  user.name.last1.value,
      'lastname':  user.name.last2.value,
      'address': {
        'ext_number': user.adress.numberExt.value,
        'neighborhood': user.adress.adressName.value,
        'zip_code': user.adress.postalCode.value,
        'city': user.adress.city.value,
        'state': this.state || 'NA',
        'country': user.adress.country.value,
        'street': user.adress.street.value
      },
      'phone_number': {
        'number': user.contact.phone.value,
         'area_code': ''
      },
      'email': user.contact.email.value.toLowerCase(),
      'username': this.userService.userNotInDb && this.userService.user.email ? this.userService.user.email.toLowerCase() : user.contact.email.value.toLowerCase(),
      'confirm_password': user.access.password.value,
      'password': user.access.password2.value,
      'avatarFileType': 'image/jpeg'
    };
    if (this.userService.user.avatar && !(new RegExp(this.userService.defaultAvatar, 'g')).test(this.userService.user.avatar)) {
      userPost['avatar_url'] = this.userService.user.avatar;
    }
    return userPost;
  }

  public toTerms(): void {
    this.router.navigateByUrl('/info/terms');
  }

  public toPrivacy(): void {
    this.router.navigateByUrl('/info/privacy');
  }

  public postUser(): Subscription {
    const userPost: any = this.userBuilder(this.user);
    this.loading = true;
    console.log('user post >', userPost);
    return this.api.post(this.api.API_PROD + 'users', userPost).subscribe(
      data => this.afterCreateData(data),
      e => this.afterCreateError(e)
      );
  }

   public actionToEdit(userBlock: any): void {
    // this function is being executed on the create-account.template.html that is why i am passing the accountCtrl.
    this.loading = true;
    const objKeys: string[] = Object.keys(userBlock);
    if (this.userService.userNotInDb) {
      console.log('user not in db >>');
      this.createUser();
      this.loading = false;
      return;
    }
    const valid: boolean = !objKeys.some((userElement: string, userElIndex: number) => {
      if (!userBlock[userElement].valid) {
        return true;
      }
    });
    if (valid) {
      let userToEdit: any = this.userBuilder(this.user);
      let url: string = this.api.API_PROD + 'users/' + this.userService.user.username;
      if (userBlock.password) {
        url = url + '/changePassword';
        userToEdit = {
          'new_password': userBlock.password.value,
          'confirm_password': userBlock.password2.value,
          'old_password': this.oldPassword
        }
      }else if (userBlock.contact) {
        userToEdit = {};
        if (userBlock.contact.phone) {
          userToEdit.phone_number.number = userBlock.contact.phone.value;
        } else if (userBlock.contact.email){
          userToEdit.email = userBlock.contact.email.value.toLowerCase();
        }
      }
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.userService.token
      };
      this.api.put(url, userToEdit, headers).subscribe(
        data => {
          this.userService.setUser(data.json());
          this.loading = false;
          this.router.navigate(['/profile/main']);
        },
        e => {
          this.afterCreateError(e);
        },
      )
    }
  }

  public minifyImgFile(file: File): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      new imgCompress(file, {
        quality: .7,
        maxWidth: 250,
         success(result: any) {
          console.log('reducing file zise quality: 0.7 width: 250px', result);
          resolve(result);
         },
          error(error: any) {
            reject(error);
          }
      });
    });
  }

  public getValuesFromPcodes(): void {
    this.user.adress.adressName.value = this.loadingTextField;
    this.user.adress.city.value = this.loadingTextField;
    // from https://github.com/Munett/API-Codigos-Postales
    this.api.get('https://api-codigos-postales.herokuapp.com/v2/codigo_postal/' + this.user.adress.postalCode.value,{}, {}).subscribe(
      data => {
        if (this.user.adress.adressName.value === this.loadingTextField) {
          this.user.adress.adressName.value = data['colonias'][0] && data['colonias'][0] + '';
        }
        if (this.user.adress.city.value === this.loadingTextField) {
          this.user.adress.city.value = data['municipio'];
        }
        this.state = data['estado'];
      },
      error => {
        if (this.user.adress.adressName.value === this.loadingTextField) {
          this.user.adress.adressName.value = '';
        }
        if (this.user.adress.city.value === this.loadingTextField) {
          this.user.adress.city.value = '';
        }
      },
      () => {
        this.selectCountry();
      }
    );
  }

  public selectCountry(country?: string): void {
    if (!this.user.adress.country.value) {
      $('.countries .select-dropdown').click();
      setTimeout(() => {
        $('.select-dropdown li span .bfh-flag-MX').click();
        setTimeout(() => {$('.countries .select-dropdown').click();}, 200);
      }, 100);
    }    
  }

   public scrollTo(domEl: ElementRef): void {
    if (domEl.nativeElement) {
      const offset = domEl.nativeElement.offsetTop - 128;
      window.scrollBy({ 
      top: offset,
      left: 0, 
      behavior: 'smooth' 
      });
    }
  }

 public ngOnChanges(changes: SimpleChanges): void {
   if (changes.creatingUser && changes.creatingUser.currentValue && this.fbUser) {
     const defaultAvatar: RegExp = new RegExp(this.userService.defaultAvatar, 'g');
     this.user.pic.value = this.user.pic.value && !defaultAvatar.test(this.user.pic.value) ? this.user.pic.value : this.fbUser.avatar_url;
     this.user.name.first.value = this.user.name.first.value || this.fbUser.name;
     this.user.name.last1.value = this.user.name.last1.value || this.fbUser.lastName;
     this.user.name.last2.value = this.user.name.last2.value || this.fbUser.lastName2;
     this.user.contact.email.value = this.user.contact.email.value || this.fbUser.email;
     this.user.adress.country.value = this.user.adress.country.value || this.fbUser['address.country'];
     this.user.access.password.value = this.fbUser.fbId;
     this.user.access.password2.value = this.fbUser.fbId;
     if (defaultAvatar.test(this.user.pic.value)) {
       this.user.pic.valid = false;
       this.globalService.clearErroMessages();
       this.globalService.setErrorMEssage('imagen invalida');
       this.globalService.openErrorModal();
       console.error('invalid avatar creating user');
       return;
     }
     this.userService.isAvatarSet = false;
     this.userCreated.emit(this.postUser.bind(this));
   }
 }

 public disableIfmf(): void {
   if (this.checkingMissingFields && this.missingFields) {
     const reqFields = ['name.first', 'name.last1', 'name.last2', 'contact.email', 'adress.country', 'contact.phone', 'pic'];
     const missingkeys = Object.keys(this.missingFields);
     const missingFrom = missingkeys.map(val => (reqFields[this.userService.reqFields.indexOf(val)] + '.value'));
     const formMissValue = missingFrom.some(prop => (!prop.split('.').reduce((a, b) => a[b], this.user)));
     const formInvalid = missingFrom.some(prop => (!prop.replace('value', 'valid').split('.').reduce((a, b) => a[b], this.user)));
     if (this.missingFields.avatar && this.user.pic.value === this.userService.defaultAvatar) {
       this.disableBtn.emit(true);
       return;
     }
     this.disableBtn.emit(formMissValue || formInvalid);
   }
 }

  public ngOnDestroy(): void {
    this.userService.validCaptcha = undefined;
    const captchaScript: JQuery = $('script#captcha-script');
    if (captchaScript.length) {
      $('script#captcha-script').detach();
    }
  }
};
