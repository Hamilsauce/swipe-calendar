import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
const { interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { switchMap, mergeMap, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;


/*  CalendarDay  */

export default class {
  constructor(date, dateService, selectionSubject$$, id, content, inputRoot = undefined) {
    this._userData = [];

    this.dateService = dateService;
    this.id = +date.toISOString().split('T')[0].replace(/-/g, '');
    this.date = date;
    this.isRendered = false;
    this.dateString = this.date.toDateString();
    this.dayName = dateService.getNameOfTimeUnit(this.date, 'weekday', 'long');
    this.dayNumber = +dateService.getNameOfTimeUnit(this.date, 'day', 'numeric');
    this.monthNumber = +dateService.getNameOfTimeUnit(this.date, 'month', 'numeric') - 1;
    this.isWeekend = ['saturday', 'sunday'].includes(this.dayName);
    this.content = content || 'No plans...';
    this._selectedDayElement;
    this._isSelected = false;
    this.root;
    this.root = inputRoot !== undefined ?
      inputRoot :
      ham.DOM.newElement('div', {
        classList: ['calendar-day', this.isWeekend ? 'weekend' : 'weekday'],
        data: { dayName: this.dayName, dayNumber: this.dayNumber }
      }, [], '');
    this.root.addEventListener('click', this.handleClicked.bind(this))

    // console.log(this);
    this.selectionSubject$ = selectionSubject$$
    this.selectionSubscription =
      merge(
        this.selectionSubject$.pipe(
          // tap(x => console.log('selected', x)),
          filter(clickEvent => typeof clickEvent === 'string' ? this.dayName === clickEvent : clickEvent.target.parentElement === this.root),
          tap(x => this.isSelected = true),
          // tap(x => console.log('selected', x)),
        ),
        this.selectionSubject$.pipe(
          filter(clickEvent => typeof clickEvent === 'string' ? this.dayName !== clickEvent : clickEvent.target.parentElement !== this.root),
          tap(x => {
            if (this.isSelected = true) {
              this.isSelected = false
              // } else {

            }

          }),
          // tap(x => console.log('not selected', x)),
        ),
      )
      .subscribe(clickEvent => {
        // console.log('clickEvent in subscribe', clickEvent.target.parentElement === this.root);
      });
    // this.selectionSubject$.pipe(
    //   // tap(x => console.log('this.selectionSubject$ in day', x)),
    //   // switchMap(targ => {
    //   filter(e => {
    //     // e.path
    //     return e.targ.classList.contains('calendar-day')
    //   }),
    //   // tap(x => console.log('this.selectionSubject$ in day', x))
    // ).subscribe()

  }

  init() {}

  get userData() { return this._userData };
  set userData(newVal) {
    this._userData = [newVal]
    this.render();
  }
  get isSelected() { return this._isSelected };
  set isSelected(newVal) {
    if (newVal === false) this.root.classList.remove('selected')
    else if (newVal === true) this.root.classList.add('selected')
    this._isSelected = newVal;
  }

  template() {
    return `
      <div class="day-header ${this.isSelected ? 'selected' :''}">${this.dayNumber}</div>
      <div class="day-body">
       ${this.userData
      // .filter((x, i) => i != 0)
        .map(event => {
          // console.log('ev', event);
            return `<div class="day-event">${event.SUMMARY || 'Unnamed Event'}</div>`
          }).join('').trim()}
      </div>
    `.trim();
  }

  render() {
    this.root.innerHTML = ''
    this.root.innerHTML = this.template();
    this.isRendered = true;
    return this.root;
  }

  handleClicked(e) {
    if (e.target.classList.contains('day-event') && this.isSelected === true) {
      e.target.classList.add('selected')
    } else {
      e.target.classList.remove('selected')
    }
    this.root.dispatchEvent(new CustomEvent('day-clicked', { bubbles: true, detail: { target: this.root } }))
    // e.stopImmediatePropagation();
  }
}