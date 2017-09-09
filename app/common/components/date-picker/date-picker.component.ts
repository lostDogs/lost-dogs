import {Component} from '@angular/core';

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
}
  // will generate year arround +-range of todays date
  public generateYears(range: number): void{
    for (let i = (this.todaysYear - range); i < (this.todaysYear + range); ++i) {
      this.years.push(i);
    }
  }
  public generateMonths(): void {
    this.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  }

  public generateDays(selectedYear: number, selectedMonth: number): void {
    const maxDay: number = new Date(selectedYear, selectedMonth, 0).getDate();
    this.days = [];
    for (let i = 1; i <= maxDay; ++i) {
      this.days.push(i);
    }
  }

  public getSeletedYearIndex(event: any): void {
    this.selectedIndexDate.year = event;
     this.generateDays(this.years[this.selectedIndexDate.year-1], this.selectedIndexDate.month+1);
  }

  public getSelectedMonthIndex(event: any): void {
    this.selectedIndexDate.month = event;
     this.generateDays(this.years[this.selectedIndexDate.year-1], this.selectedIndexDate.month+1);
  }

}
