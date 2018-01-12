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
  public seletedDateEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Input()
  public rechangeDate: string;

  constructor()  {
    const currentTime = new Date();
    this.todaysYear = currentTime.getFullYear();
    this.todaysMonth = currentTime.getMonth() + 1;
    this.todaysDay = currentTime.getDate();    
    this.years = [];
    this.months = [];
    this.days = [];
    this.selectedIndexDate ={year: 0, month: 0, day: 0};
    this.generateYears();
    this.generateMonths();    
  }

  public ngOnInit(): void {
    $('text-scroll').nodoubletapzoom();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.rechangeDate && changes.rechangeDate.currentValue) {
     const dateFromEdit: string = changes.rechangeDate.currentValue;
     const day: number = +dateFromEdit.split('/')[2];
     const month: number = +dateFromEdit.split('/')[1];
     const year: number = +dateFromEdit.split('/')[0];
     const indexedYear: number = this.years.indexOf(+year);
     this.selectedIndexDate.year = indexedYear !== -1 ? indexedYear: this.todaysYear;
     this.selectedIndexDate.month = month >= 1 && month <= 12 ? +month - 1 : this.todaysMonth;  
     this.selectedIndexDate.day = day >= 1 && day <= this.getMaxDay(year, month) ? day - 1 : this.todaysDay;
    } else if (changes.seletedDate && changes.seletedDate.currentValue) {
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
       //this.selectedIndexDate.year = year;
       //this.selectedIndexDate.month = month >= 1 && month <= 12 ? month : this.todaysMonth;
        if (day >= 1 && day <= this.getMaxDay(year, month)) {
          this.selectedIndexDate.day = day - 1;
        }
      }
    }
  }
  // will generate year arround +-range of todays date or if not range, will generate from todays to back.
  public generateYears(range?: number): void{
    this.years = [];
    if (range) {
      for (let i = (this.todaysYear - range); i < (this.todaysYear + range); ++i) {
        this.years.push(i);
      }
    } else  {
      for (let i = this.todaysYear - 3; i <= this.todaysYear; i++) {
        this.years.push(i);
      }
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
    this.days = JSON.parse(JSON.stringify(this.days));
  }

  public getSeletedYearIndex(event: any): void {
    this.selectedIndexDate.year = event;
    this.generateDays(this.years[this.selectedIndexDate.year], this.selectedIndexDate.month + 1);
    this.adjustMonths();
    this.adjustDays();
    this.generateDate();
  }

  public adjustMonths(): void {
    const selectedYear = this.years[this.selectedIndexDate.year];
    const todaysMonth = this.todaysMonth;
    if (selectedYear === this.todaysYear) {
      this.months.splice(todaysMonth, this.months.length);
      this.months = JSON.parse(JSON.stringify(this.months));
    }else {
      this.generateMonths();
    }
  }

  public adjustDays(): void {
    // generate days should be call firts.
    const selectedYear = this.years[this.selectedIndexDate.year];
    const todaysMonth = this.todaysMonth;
    const selectedMonth = this.selectedIndexDate.month + 1;
    if (selectedMonth === todaysMonth && selectedYear === this.todaysYear) {
      this.days.splice(this.todaysDay, this.days.length);
      this.days = JSON.parse(JSON.stringify(this.days));
    }else {
      this.generateDays(this.years[this.selectedIndexDate.year], this.selectedIndexDate.month + 1);
    }
  }

  public getSelectedMonthIndex(event: any): void {
    this.selectedIndexDate.month = event;
     this.generateDays(this.years[this.selectedIndexDate.year], this.selectedIndexDate.month + 1);
     this.adjustDays();
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
