import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
// import { DateService } from '../services/DateService.js'
// import CalendarDay from './CalendarDay.js'
// import CalendarMonth from './CalendarMonth.js'

/*  Label Column  */

export default class {
  constructor(root, ...daysToDisplay) {
    this.root = root;
    this.labels = this.createLabels(...daysToDisplay)
    this.dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    this.selectedLabel = null;
    this._isSelected;
  }

  get isSelected() { return this._isSelected }
  set isSelected(newValue) {this._isSelected = newValue  }

  createLabels(dayList) { return dayList.map(day => { return `<div class="day-label" data-day-name="${day}">${day.slice(0)[0].toUpperCase()}${day.slice(1,3).toLowerCase()}</div>` }) }

  render() {
    [...this.root.children].forEach(
      (child, i, labs) => {
        child.addEventListener('click', e => {
          labs.forEach(label => {
            label.isSelected = false;
            label.classList.remove('active');
          });

          child.classList.toggle('active');
          // this.selectedLabel = this.selectedLabel === child.dataset.dayName ? null : child.dataset.dayName;
          this.selectedLabel = this.selectedLabel === child.dataset.dayName ? null : child.dataset.dayName;
          this.root.dispatchEvent(new CustomEvent('day-label-clicked', { bubbles: true, detail: { day: this.selectedLabel } }))
        })
      });
    return this.root;
  }
}