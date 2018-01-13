import { Component, Input} from '@angular/core';
import {ValidationService} from  '../../common/services/validation.service';
import {ApiService} from '../../common/services/api.service';
import * as countryData from '../../common/content/countries.json';
import {Router} from '@angular/router';
import {UserService} from '../../common/services/user.service';
import {GlobalFunctionService} from '../../common/services/global-function.service';

export interface formObj {
  valid: boolean;
  value: any;
  required: boolean;
  label?: string;
}

export interface Iuser {
  pic: formObj;
  name: {first: formObj, last1: formObj, last2: formObj};
  adress: {adressName: formObj, postalCode: formObj, city: formObj, numberExt: formObj, numberInt: formObj, country: formObj};
  contact: {areaCode: formObj, phone: formObj, email: formObj};
  access: {userName: formObj, password: formObj, password2: formObj};
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
  @Input()
  public title: string = 'Crea tu cuenta';
  @Input()
  public profilePage: boolean;
  @Input()
  public orginalUser: Iuser;
  @Input()
  public disableButton: (userBlock: any, originalUserBlock: any) => void;
  @Input()
  public hoverRetainState: () => void;
  //only used in profile/edit
  public oldPassword: string;

  constructor (public validate: ValidationService, public api: ApiService, public router: Router, public userService: UserService, public globalService: GlobalFunctionService) {
    this.countries = countryData;
    // define the user object before
    this.user = {
      pic: {value:'./static/profile-undef.png', valid: true, required: true, label: 'imagen de perfil'},
      name: {
        first: {valid: true, value: undefined, required: true},
        last1: {valid: true, value: undefined, required: true},
        last2: {valid: true, value: undefined, required: true}
      },
      adress: {
        adressName: {valid: true, value: undefined, required: true},
        postalCode: {valid: true, value: undefined, required: true},
        city: {valid: true, value: undefined, required: true},
        numberExt: {valid: true, value: undefined, required: true},
        numberInt: {valid: true, value: undefined, required: false},
        country: {valid: true, value: undefined, required: true}
      },
      contact: {
        areaCode: {valid: true, value: undefined, required: true},
        phone: {valid: true, value: undefined, required: true},
        email: {valid: true, value: undefined, required: true}
      },
      access: {
        userName: {valid: true, value: undefined, required: true},
        password: {valid: true, value: undefined, required: true},
        password2: {valid: true, value: undefined, required: true}
      }
    };
  }

  public ngAfterViewInit(): void {
   $('select').material_select();
   if (this.hoverRetainState)  {
     this.hoverRetainState();
   }
   if (this.profilePage && this.userService.user.address.country) {
      $('#country option[value=' + this.userService.user.address.country + ']').attr('selected','selected');
      $('#country').change();
      let countrySelected: string
      this.countries.some((value: any) => {
        if (value.id === this.userService.user.address.country) {
          return countrySelected = value.name;
        }
      });
      $('input[type=text].select-dropdown').val(countrySelected);
   }
  }

  public ngOnInit(): void {
    $('select').change(() => {
      const input = $('#country');
      this.user.adress.country.value = input.val();
      this.user.adress.country.valid = true;
    });
    this.user.adress.country.value = undefined;
  }

  public createUser (form: any): void {
    // Check for undefined and set formvalue to false
    let validForm: boolean = true;
    const userFirts: any[] = Object.keys(this.user);
    this.globalService.clearErroMessages();
    userFirts.forEach((userKey: any, elementIndex: number) => {
      const element: any = this.user[userKey];
      const propKey: any = Object.keys(element);
      if (element instanceof Object && element[propKey[0]] instanceof Object) {
        for (let i = 0; i < propKey.length; i++) {
          const content: string = element[propKey[i]].value;
          if (element[propKey[i]].required && !content) {
            element[propKey[i]].valid = false;
            validForm = false;
          }else if (!element[propKey[i]].valid) {
            validForm = false;
            this.globalService.setErrorMEssage(propKey[i] +' invalido');
            break;
          }
        }
      } else {
        const fieldName = element.label ? element.label : userKey;
        if (element.required && (!element.value || element.value === './static/profile-undef.png' ) ) {
          element.valid = false;
          validForm = false;
          this.globalService.setErrorMEssage(fieldName +' requerido');
        } else if (!element.valid) {
          validForm = false;
          this.globalService.setErrorMEssage(fieldName +' invalido');
        }
      }
    });
    if (validForm) {
      this.postUser();
    } else {
      this.globalService.openErrorModal();
    }
  }

  public filePicChange(ev: any): void {
    const file: File = ev.target.files[0];
      this.binaryImg = file;
      if (ev.target && ev.target.files && file && file.type.match('image.*')) {
        try {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.user.pic.value = event.target.result;
            this.user.pic.valid = true;
          };
          reader.readAsDataURL(file);
        }catch (error) {
          // do nothing
        }
      } else {
        this.user.pic.valid = false;
        this.user.pic.value = './static/profile-undef.png';
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
    this.api.put(url, this.binaryImg, {'Content-Type': 'image/jpeg', 'Content-encoding': 'base64'}).subscribe(
      data => this.sucessImgToBucket(data),
      e => this.errorImgToBucket(e)
    );
  }

  public sucessImgToBucket(data: any): void {
    console.log('sucessfully created', data);
    this.userService.isAvatarSet = true
  }
  public toHomePage(): void {
    this.loading = false;
    this.router.navigate(['/home'], {queryParams:{nU: true}});
    window.scroll(0,0);
  }

  public afterCreateData(data: any): void {
    this.setImgToBucket(data.uploadAvatarUrl);
    this.userService.setUser(data);
    this.loading = false;
  }

  public afterCreateError(e: any): void {
    let errorMessage: string = this.globalService.parseJsonError(e);
    this.globalService.setErrorMEssage(errorMessage);
    this.globalService.openErrorModal();
    this.loading = false;
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
        'country': user.adress.country.value,
        'street': 'ads'
      },
      'phone_number': {
        'number': user.contact.phone.value,
        'area_code': user.contact.areaCode.value
      },
      'email': user.contact.email.value,
      'username': user.access.userName.value,
      'confirm_password': user.access.password.value,
      'password': user.access.password2.value,
      'avatarFileType': 'image/jpeg'
    };
    return userPost;
  }

  public toTerms(): void {
    this.router.navigateByUrl('/info/terms');
  }

  public toPrivacy(): void {
    this.router.navigateByUrl('/info/privacy');
  }

  public postUser(): void {
    const userPost: any = this.userBuilder(this.user);
    this.loading = true;
    this.api.post('https://fierce-falls-25549.herokuapp.com/api/users', userPost).subscribe(
      data => this.afterCreateData(data),
      e => this.afterCreateError(e),
      () => this.toHomePage()
      );
  }

   public actionToEdit(userBlock: any): void {
    // this function is being executed on the create-account.template.html that is why i am passing the accountCtrl.
    this.loading = true;
    const objKeys: string[] = Object.keys(userBlock);
    const valid: boolean = !objKeys.some((userElement: string, userElIndex: number) => {
      if (!userBlock[userElement].valid) {
        return true;
      }
    });
    if (valid) {
      let userToEdit: any = this.userBuilder(this.user);
      let url: string = 'https://fierce-falls-25549.herokuapp.com/api/users/' + this.userService.user.username;
      if (userBlock.password) {
        url = url + '/forgotPassword';
        userToEdit = {
          new_password: userBlock.password.value,
          confirm_password: userBlock.password2.value,
          old_password: this.oldPassword
        }
      }
      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.userService.token
      };
      console.log('token', this.userService.token);
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
};
