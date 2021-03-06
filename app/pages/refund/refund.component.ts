import { Component, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../common/services/user.service';
import {OpenSpayService} from '../../common/services/openspay.service';
import {MailingRewardService} from '../../common/services/mailing-reward.service';
import {DogCardService} from '../../common/services/dog-card.service';
import {GlobalFunctionService} from '../../common/services/global-function.service';

@Component({
  selector: 'refund',
  template: require('./refund.template.html'),
  styles: [ require('./refund-style.scss')]
})
export class RefundComponent {
  public transcationId: string;
  public nextSure: boolean;
  @ViewChild('RefundReason')
  public RefundReasonDom: ElementRef;
  @ViewChild('RefundSucess')
  public RefundSucessDom: ElementRef;
  public reasonVal: string;
  public reason: JQuery;

  constructor (
    public userService: UserService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public openPay: OpenSpayService,
    public rewardService: MailingRewardService,
    public dogService: DogCardService,
    public globalService: GlobalFunctionService
  ) {
    this.openPay.refundData = undefined;
    this.rewardService.transaction = undefined;
    this.dogService.dogData = undefined;
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.transcationId = params.transcation;
      this.rewardService.getTransaction(this.userService.token, this.transcationId).add(() => {
        if (this.rewardService.transaction && this.rewardService.transaction.lost_id !== this.userService.user.id) {
          this.globalService.clearErroMessages();
          this.globalService.setErrorMEssage('No eres el usuario correcto');
          this.globalService.openErrorModal();
          this.router.navigate(['/login']);

        } else if (this.rewardService.transaction && (/failed/g.test(this.rewardService.transaction.status) || /success/g.test(this.rewardService.transaction.status))) {
          this.globalService.clearErroMessages();
          this.globalService.setErrorMEssage(/failed/g.test(this.rewardService.transaction.status) ? 'Ya se realizó un rembolso previo' : 'Ya se pagó la recompensa');
          this.globalService.openErrorModal();
          this.router.navigate(['/login']);
        }
      });
    });    
  }

  public ngOnInit(): void {
    if (!this.userService.isAuth) {
      this.userService.previousUrl = this.router.url;
      this.router.navigate(['/login']);
    }
  }

  public ngAfterViewInit(): void {}

  public nextStep(): void {
    this.nextSure = true;
    this.scrollTo(this.RefundReasonDom);
    setTimeout(() => {
      this.reason =  $('#refund-reason');
    }, 10)
  }

  public resize(): void {
    this.reason.trigger('autoresize');
    this.reasonVal =this.reason.val();
  }

  public scrollTo(domEl: ElementRef): void {
    if (domEl.nativeElement) {
      setTimeout(() => {
        const offset = domEl.nativeElement.offsetTop - 120;
        $('html, body').animate({ scrollTop: offset}, 700);
      }, 300);
    }
  }

  public refundme(): void {
    this.openPay.refund(this.userService.token, this.transcationId).add(() => {
      if (this.openPay.refundData) {
        this.scrollTo(this.RefundSucessDom);
      }
    });
  }
};
