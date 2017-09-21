import {Component, Output, Input, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'date-picker',
  template: require('./date-picker.template.html'),
  styles: [ require('./date-picker.scss')]
})

export class DatePickerComponent {
  public todaysYear: number;
  public todaysDay: number;
  public todaysMonth: any;
  public years: number[];
  public months: string[];
  public days: number[];
  public selectedIndexDate: {year: number, month: number, day: number};
  @Input()
  public seletedDate: string;
  @Output()
  public question: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public inputFeildEmiter: EventEmitter<any> = new EventEmitter<any>();
  public inputField: {type: string, label: string};
  @Output()
  public seletedDateEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor()  {
    const currentTime = new Date();
    this.todaysYear = currentTime.getFullYear();
    this.todaysMonth = currentTime.getMonth() + 1;
    this.todaysDay = currentTime.getDate();
    this.years = [];
    this.months = [];
    this.days = [];
    this.selectedIndexDate ={year: 0, month: 0, day: 0};
  }

  public ngOnInit(): void {
    this.generateYears(10);
    this.generateMonths();
    $('text-scroll').nodoubletapzoom();
    this.question.emit('Cuando lo Perdiste?');
    this.inputField = {type: 'date', label: 'dd/mm/aaaa'};
    this.inputFeildEmiter.emit(this.inputField);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.seletedDate && changes.seletedDate.currentValue) {
      const dateFromInput: string = changes.seletedDate.currentValue;
      if (dateFromInput.length === 4) {
        const indexedYear: number = this.years.indexOf(+dateFromInput);
        if (indexedYear !== -1) {
          this.selectedIndexDate.year = indexedYear;
        }        
      } else if (dateFromInput.length === 7 && +dateFromInput.split('/')[1] >= 1 && +dateFromInput.split('/')[1] <= 12) {
        const month: string = dateFromInput.split('/')[1];
        this.selectedIndexDate.month = +month - 1;
      }else if (dateFromInput.length === 10) {
        const day: number = +dateFromInput.split('/')[2];
       const month: number = +dateFromInput.split('/')[1];
       const year: number = +dateFromInput.split('/')[0];
        if (day >= 1 && day <= this.getMaxDay(year, month)) {
          this.selectedIndexDate.day = day - 1;
        }
      }
    }
  }
  // will generate year arround +-range of todays date
  public generateYears(range: number): void{
    this.years = [];
    for (let i = (this.todaysYear - range); i < (this.todaysYear + range); ++i) {
      this.years.push(i);
    }
  }
  public generateMonths(): void {
    this.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  }

  public getMaxDay(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  public generateDays(selectedYear: number, selectedMonth: number): void {
    const maxDay: number = this.getMaxDay(selectedYear, selectedMonth);
    this.days = [];
    for (let i = 1; i <= maxDay; ++i) {
      this.days.push(i);
    }
  }

  public getSeletedYearIndex(event: any): void {
    this.selectedIndexDate.year = event;
    this.generateDays(this.years[this.selectedIndexDate.year-1], this.selectedIndexDate.month+1);
    this.generateDate();
  }

  public getSelectedMonthIndex(event: any): void {
    this.selectedIndexDate.month = event;
     this.generateDays(this.years[this.selectedIndexDate.year-1], this.selectedIndexDate.month+1);
     this.generateDate();
  }

  public getSelectedDayIndex(event: any): void {
   this.selectedIndexDate.day = event;
   this.generateDate();
  }

  public generateDate(): void {
    const month: string = String(this.selectedIndexDate.month + 1);
    const day: string = String(this.selectedIndexDate.day + 1);
    const monthTwoDigit: string = month.length < 2 ? '0' + month : month;
    const dayTwoDigit: string = day.length < 2 ? '0' + day : day;
    this.seletedDate = this.years[this.selectedIndexDate.year] + '/' +monthTwoDigit + '/' + dayTwoDigit;
    this.seletedDateEmitter.emit(this.seletedDate);
  }

}
