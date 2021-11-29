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
    this.date = new Date(Date.now());
    this.dateString = this.date.toDateString()
    this.dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    this.counter = 0;

    this.selectionSubject$ = new Subject() //.pipe(tap(x => console.log('dkdk', x)))
    this.click$ = fromEvent(this.root, 'click')
      .pipe(
        filter(e => {
          return ['calendar-day', 'day-header', 'day-body', 'day-event'].includes(e.target.className)
        }),
      )
      .subscribe(this.selectionSubject$)

    this.dayLabelSubject = new Subject() //.pipe(tap(x => console.log('dkdk', x)))
    this.dayLabelClick$ = fromEvent(this.root, 'day-label-click')
      .pipe(
        filter(e => {
          return e.path.some(x => {
            if (x.classList) {
              return x.classList.contains('day-label-container') || x.classList.contains('day-label') || x.classList.contains('day-body') || x.classList.contains('day-header');
            }
          })
        }),
        map(x => x.detail.day),
      )
      .subscribe(this.selectionSubject$)
    this.labelColumn = new LabelColumn(this.root.querySelector('.day-label-container'), this.selectionSubject$, this.dayNameList);

    this.renderCalendar(this.date);
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
      this.activeMonth = new CalendarMonth(date, this.dateService, filteredUserData$, this.selectionSubject$).instance
      this.activeMonth.handleSwipe(swipeDirection)
      this.activeMonth.renderDays();

      this.updateMonthDisplay();
      this.root.appendChild(this.activeMonth.root)
    }, 0)
  }

  updateMonthDisplay() {
    this.root.querySelector('.calendar-month-display').innerHTML = `
      <div class="month-display">${ham.text.capitalize(this.dateService.getNameOfTimeUnit(this.date))}</div>
      <div class="year-display">${this.date.getFullYear()}</div>
    `.trim();
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
      this.renderCalendar(newDate, swipeDirection);
      this.root.dispatchEvent(new CustomEvent('calendar-month-changed', { bubbles: true, detail: { date: newDate } }));
      this.updateMonthDisplay();
    }, 300);
  }
};

const fetchCalendarData = () => {}

const calendarFactory = (selector, userData$) => {
  return new Calendar(selector, new DateService(), userData$)
};

// export default calendarFactory('.calendar', userData$)