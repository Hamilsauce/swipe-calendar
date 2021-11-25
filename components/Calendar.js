import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
import { DateService } from '../services/DateService.js'
import CalendarDay from './CalendarDay.js'
import CalendarMonth from './CalendarMonth.js'
import LabelColumn from './LabelColumn.js'
import userData$ from '../data/cal-parser.js'

const { interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { switchMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

/*  Calendar  */
export class Calendar {
  constructor(selector = '.calendar', dateService, userData$) {
    this.root = document.querySelector('.calendar');
    this.dateService = dateService
    this.userData$ = userData$
    // this.calendarBody;
    this.date = new Date(Date.now());
    this.dateString = this.date.toDateString()
    this.dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    this.labelColumn = new LabelColumn(this.root.querySelector('.day-label-container'), this.dayNameList);
    this.labelColumn.render();
    this.counter = 0;

    this.clickSubject = new Subject() //.pipe(tap(x => console.log('dkdk', x)))
    // console.log('Subject', this.clickSubject)

    this.click$ = fromEvent(this.root, 'click')
      .pipe(
        // take(1),
        filter(e => {
          return ['calendar-day', 'day-header', 'day-body', 'day-event'].includes(e.target.className)
          // return e.some(t => t.classList.contains('calendar-day'))
        }),
      )
      .subscribe(this.clickSubject)

    this.renderCalendar(this.date);

    // this.clickSubject.subscribe()
    //  this.root.addEventListener('day-label-clicked', this.handleLabelClicked.bind(this))
    //  this.root.addEventListener('day-clicked', this.handleDayClicked.bind(this))
    this.root.addEventListener('swipe-action', this.handleCalendarSwipe.bind(this))

  }

  renderCalendar(date, swipeDirection = null) {
    this.counter++
    ham.DOM.qs('.header-date').textContent = this.dateString
    const filteredUserData$ = this.userData$
    // .pipe(
    //   take(1),
    //   map(data => {
    //     return data.filter(evt => {
    //       if (!evt.DTSTART) return false;
    //       return evt.DTSTART.getFullYear() === date.getFullYear() && evt.DTSTART.getMonth() === date.getMonth()
    //     })
    //   }),
    // )


    setTimeout(() => {
      this.activeMonth = new CalendarMonth(date, this.dateService, filteredUserData$, this.clickSubject).instance
      // this.calendarBody = this.activeMonth.root;
      this.activeMonth.handleSwipe(swipeDirection)
      this.updateMonthDisplay();
      this.activeMonth.renderDays();
      this.root.appendChild(this.activeMonth.root)
      const swipeClass = swipeDirection === 'right' ? 'monthChangeRightEnter' : 'monthChangeLeftEnter'
      // this.activeMonth.root.classList.add(swipeClass)
    }, 0)
  }

  updateMonthDisplay() {
    const month = this.dateService.getNameOfTimeUnit(this.date)
    const year = this.date.getFullYear();
    this.root.querySelector('.calendar-month-display').innerHTML = `
     <div class="month-display">${ham.text.capitalize(month)}</div>
     <div class="year-display">${year}</div>
    `.trim();
    // this.root.querySelector('.calendar-month-display').children[0].textContent = `${ham.text.capitalize(month)}`;
    // this.root.querySelector('.calendar-month-display').children[0].textContent = ` ${year}`;
  }

  createFunction(fn) {}

  handleLabelClicked(e) {
    e.stopPropagation();
    this.activeMonth.getDaysByName(e.detail.day)
  }

  handleDayClicked(e) {
    // console.log('IN CALENDAR, this: ', this)
  }

  handleCalendarSwipe(e) {
    const swipeDirection = e.detail.swipeDirection
    const swipeClass = swipeDirection === 'right' ? 'monthChangeRightLeave' : 'monthChangeLeftLeave'
    let thisMonth;
    // this.activeMonth.root.classList.add(swipeClass);
    if (this.activeMonth !== undefined) {
      this.activeMonth.destroy(swipeDirection);
    }

    setTimeout(() => {
      if (this.activeMonth !== undefined) {
        this.root.removeChild(this.activeMonth.root)
        delete this.activeMonth.instance
        delete this.activeMonth

      }


      if (swipeDirection === 'left') {
        thisMonth = this.date.getMonth() + 1;
        this.date.setMonth(thisMonth);
      } else if (swipeDirection === 'right') {
        thisMonth = this.date.getMonth() - 1;
        this.date.setMonth(thisMonth);
      }

      const newDate = new Date(this.date.getFullYear(), thisMonth + 1, 0);
      // this.activeMonth.root.classList.add(swipeClass);
      //HERE?
      this.renderCalendar(newDate, swipeDirection);
      this.root.dispatchEvent(new CustomEvent('calendar-month-changed', { bubbles: true, detail: { date: newDate } }));
      this.updateMonthDisplay();
    }, 300);

    // this.activeMonth.root.classList.remove(swipeClass);
    // this.activeMonth.root.classList.remove('monthChangeLeftLeave');
    // this.activeMonth.root.classList.remove('monthChangeLeftEnter');
    // this.activeMonth.root.classList.remove('monthChangeRightLeave');
    // this.activeMonth.root.classList.remove('monthChangeRightEnter');
  }
};

const fetchCalendarData = () => {}

const calendarFactory = (selector, userData$) => {
  return new Calendar(selector, new DateService(), userData$)
};

// export default calendarFactory('.calendar', userData$)