import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
import CalendarDay from './CalendarDay.js'
import { DateService } from '../services/DateService.js'

const { interval, of , fromEvent, merge, empty } = rxjs;
const { switchMap, mergeMap, filter, scan, takeWhile, startWith, take, tap, map, mapTo } = rxjs.operators;

/*  CalendarMonth  */

export default class {
  constructor(date, dateService, userData$, clickSubject, calendarBodySelector = '.calendar-body') {
    this.dateService = new DateService();
    this.date = date;
    this.root = this.getRootEl(calendarBodySelector)
    this.userData;
    this.userData$ = userData$;
    this.userDataSubscription;
    this.clickSubject = clickSubject //.next(x => console.log('next',x));

    this._dayMap = undefined;
    this.dayMap = new Map();
    this._selectedDaysMap = new Map();

    this.monthNumber = +this.dateService.getNameOfTimeUnit(this.date, 'month', 'numeric') - 1;
    this.monthName = this.dateService.getNameOfTimeUnit(this.date, 'month');
    this.dateString = this.date.toDateString();
    this.daysInMonth = this.dateService.daysInMonth(this.date.getMonth(), this.date.getFullYear());
    this._selectedDayElement = null;
    this._selectedDays = null;
    this.swipeClass = null;
   
    this.root.addEventListener('day-clicked', this.handleDayClicked.bind(this));
    this.instance = this;
    this.dayCounter = 0;
    this.mounted = false;
    // setInterval(() => {
    //   console.log('calendarmonth: ' + this.monthName);
    // }, 2000)
  }

  destroy(swipe) {
    this.handleSwipe(swipe);

    setTimeout(() => {
      for (let [dayEl, data] of this.dayMap) {
        data.clickSubscription.unsubscribe();
        this.root.removeChild(dayEl);
        this.dayMap.delete(dayEl);
        ++this.dayCounter;
      }

      setTimeout(() => {
        this.dayMap.clear()
        this.userDataSubscription.unsubscribe()
        delete this.userData$;
        delete this.dateService;
        delete this.userData;
        delete this.clickSubject;
        delete this.instance;
      }, 0);
    }, 300)
  }

  handleSwipe(swipe) {
    if (this.mounted === true) {
      this.root.classList.remove(this.swipeClass);
      this.swipeClass = swipe === 'right' ? 'monthChangeRightLeave' : 'monthChangeLeftLeave'
    }
    else this.swipeClass = swipe === 'right' ? 'monthChangeRightEnter' : 'monthChangeLeftEnter'
    this.root.classList.add(this.swipeClass);
    this.mounted = true;
  }

  getRootEl(selector) {
    if (document.querySelector(selector)) return document.querySelector(selector)

    const el = document.createElement('div');
    el.classList.add(selector.slice(1));
    return el;
  }

  get dayMap() { return this._dayMap }
  set dayMap(newVal) { this._dayMap = newVal }

  get keyElements() { return [...this.dayMap.keys()] }

  get selectedDaysMap() { return new Map(this.keyElements.filter(keyEl => this.dayMap.get(keyEl).isSelected).map(keyEl => this.getDay(keyEl))) }
  set selectedDaysMap(newSelectedDay) {}

  get selectedDayElement() { return this._selectedDayElement }
  set selectedDayElement(newSelectedDay) {
    const noSelectedDay = this._selectedDayElement === null || undefined;
    this.setSelectedDays(...newSelectedDay)

    if (noSelectedDay) {
      const sel = newSelectedDay;
      const selData = this.dayMap.get(sel);
      selData.isSelected = true
      this._selectedDayElement = sel
    } else if (this._selectedDayElement === newSelectedDay) {
      this.dayMap.get(this.selectedDayElement).isSelected = false;
      this._selectedDayElement = null;
    } else {
      this.dayMap.get(this.selectedDayElement).isSelected = false;
      this._selectedDayElement = newSelectedDay;
      this.dayMap.get(this.selectedDayElement).isSelected = true;
    }
  }

  setSelectedDays(...selected) {
    for (let [dayEl, data] of this.dayMap) {
      data.isSelected = false;
    }
    selected.forEach(({ data }) => data.isSelected = true);
  }

  getDaysByName(name = null) {
    this.setSelectedDays(...this.keyElements
      .filter(keyEl => this.dayMap.get(keyEl).dayName === name)
      .map(keyEl => this.getDay(keyEl))
    )
  }

  dayMapFromDOM() {
    const daymap = this.dayMap2;
    const children = [...this.root.children]
    children.forEach(child => this.dayMap2.set(...this.createDay(new Date(2021, this.monthNumber, i + 1), i)))
  }

  deleteDay(e) {
    this.dayMap.delete(e.target);
    this.root.removeChild(e.target)
  }

  getDay(keyElement = undefined) {
    if (keyElement) return { element: this.dayMap.get(keyElement).root, data: this.dayMap.get(keyElement) }
    else console.error('No key element passed to getDay(). CalendarMonth.js');
  }

  handleDayClicked(e) {
    this.setSelectedDays(this.getDay(e.detail.target))
    // e.stopPropagation();
  }

  createDay(date, data = null, id, el) {
    const newDay = new CalendarDay(date, this.dateService, this.clickSubject, id, el);
    const dayEl = newDay.render();

    return [dayEl, newDay]
  }

  distributeUserData(userData = []) {
    this.keyElements.forEach(key => {
      const day = this.dayMap.get(key);
      const dayDate = day.date;
      userData.forEach(item => {
        if ((item.DTSTART.getFullYear() == dayDate.getFullYear()) && (item.DTSTART.getMonth() == dayDate.getMonth()) && (item.DTSTART.getDate() == dayDate.getDate())) {
          day.userData = item;
        }
      })
    })
  }

  mapDays(userData) {
    let counter = 0;
    this.dayMap.clear();
    // console.log('mapDays', userData);

    for (let i = 0; i < this.daysInMonth; i++) {
      counter++
      // console.log('line 140 in month', { counter });
      const dayDate = new Date(this.date.getFullYear(), this.monthNumber, i + 1)
      this.dayMap.set(...this.createDay(new Date(this.date.getFullYear(), this.monthNumber, i + 1), i));
    }
  }

  renderDays(swipeDirection = null) {

    // console.log('swipeDirection', swipeDirection)
    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild)
    }
    this.mapDays(this.userData || [])
    for (let [dayEl, data] of this.dayMap) {
      if (data.monthNumber !== this.monthNumber) {
        dayEl.style.display = 'none';
        this.dayMap.delete(dayEl)
      } else {

        this.root.appendChild(dayEl);
        ++this.dayCounter
      }
    }
    this.userDataSubscription = this.userData$.pipe(
      map(data => data),
      tap(data => {
        this.userData = data;
      }),
    ).subscribe(x => {
      // console.log('in daya sub', x);
    })
  }

}