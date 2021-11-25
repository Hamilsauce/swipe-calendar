import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
import { DateService } from '../services/DateService.js'
import { Calendar } from './Calendar.js'
import StateService from '../services/StateService.js'
import userData$ from '../data/cal-parser.js'
// App
// new Calendar(selector, new DateService(), userData$)

export default class App {
  constructor() {
    this.root = document.querySelector('.app')
    this.userData$ = userData$;
    this.calendar = new Calendar('.calendar', new DateService(), this.userData$);
    this.dateService = new DateService();
    this.stateService = new StateService();
    this.calendarData;
    this.root.addEventListener('calendar-month-changed', this.handleSwipeAction.bind(this))
    this.root.addEventListener('dataloaded', this.handleDataLoaded.bind(this))
    
  }

  handleDataLoaded(e) {
  // console.log('dataloard', e);
    this.calendarData = e.detail.data;
  }

  handleSwipeAction(e) {
    const month = this.dateService.getNameOfTimeUnit(e.detail.date)
    const year = e.detail.date.getFullYear();
    this.root.querySelector('.calendar-month-display').textContent = `${ham.text.capitalize(month)} ${year}`;
  }

}