import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
// import { DateService } from '../services/DateService.js'
// import CalendarDay from './CalendarDay.js'
// import CalendarMonth from './CalendarMonth.js'

const { interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { switchMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;
const { array } = ham;
ham.help('label component', 'DOM', 'text')
/*  Label Column  */

export default class {
  constructor(root, selectionSubject$, ...daysToDisplay) {
    this.root = root;
    this.labels = [...this.root.children];
    this.labelMap = new Map(array.zip(this.labels, this.labels.map((l, i) => l.dataset.dayName)))
    this.render.bind(this)();
    this.dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    this.selectedLabel = null;
    this._isSelected;
    this.selectionSubject$ = selectionSubject$
    this.selectionSubscription = this.selectionSubject$
      .pipe(
        filter(e => e !== undefined),
        tap(e => {
          this.labelMap.forEach((dayName,label) => {
            label.dataset.isSelected = false;
            label.classList.remove('active');
          });
        }),
      ).subscribe();


  }

  get isSelected() { return this._isSelected }
  set isSelected(newValue) { this._isSelected = newValue }

  createLabels(dayList) {
    // return dayList.forEach((day, i) => {
    //   const el = ham.DOM.newElement('div,', { classList: ['day-label'], data: { dayName: day } })
    //   el.textConent = `${day.slice(0)[0].toUpperCase()}${day.slice(1,3).toLowerCase()}`
    //   this.root.appendChild(el)
    // })
    //, new Map());
    return dayList.map(day => {
      // return
      return `<div class="day-label" data-day-name="${day}">${day.slice(0)[0].toUpperCase()}${day.slice(1,3).toLowerCase()}</div>`
    })
  }

  render() {
     
    // [...this.root.children]
    
      // .forEach(
      // (dayName, labelEl) => {
      // labelEl
      this.root.addEventListener('click', e => {
        this.labelMap.forEach((dayName, labelEl) => {
          // labelEl.dataset.isSelected = false;
          // labelEl.classList.remove('active');
          // this.selectedLabel = this.selectedLabel === labelEl.dataset.dayName ? '' : labelEl.dataset.dayName;
          if (e.target === labelEl || e.target.parentElement === labelEl) {
            labelEl.dataset.isSelected = true;
            labelEl.classList.add('active');
          } else {
            labelEl.dataset.isSelected = false;
            labelEl.classList.remove('active');

          }

          // if (this.selectedLabel === labelEl.dataset.dayName) {
          //   labelEl.classList.add('active');

          // } else {
          //   labelEl.classList.remove('active');

          // }
          // this.selectedLabel = this.selectedLabel === child.dataset.dayName ? null : child.dataset.dayName;
          // this.selectedLabel = this.selectedLabel === child.dataset.dayName ? null : child.dataset.dayName;
          this.root.dispatchEvent(new CustomEvent('day-label-click', { bubbles: true, detail: { day: this.labelMap.get(e.target) } }))
        });
        // })
      });
    return this.root;
  }
}