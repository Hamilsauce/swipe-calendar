/*

weekday, year, month, day, hour, minute, second 

*/

var locale = "en-US",
  numFormat = new Intl.NumberFormat(locale),
  dateFormat = new Intl.DateTimeFormat(locale),
  collator = new Intl.Collator(locale); // print options object to the console. Unset options are not included

var options = numFormat.resolvedOptions();
// console.log('numFormat.resolvedOptions();', options); // access individual options
// console.log("Style: " + options.style);
// same method exists for dateTime and collator, but returns different options

// console.log(dateFormat.resolvedOptions());
// console.log(collator.resolvedOptions());



export class DateService {
  constructor(LOCALE = 'en-US') {
    this.LOCALE = LOCALE
  }

  isValidDateValue(value) {
    const isStringOrNumber = typeof value === 'string' || typeof value === 'number' ? true : false;
    const canBeParsed = !isNaN(Date.parse(value)) ? true : false;
    return isStringOrNumber && canBeParsed;// ? true : false;
  }

  isInstanceOfDate(value) { return value instanceof Date ? true : false }

  normalizeDateValue(dateValue) {
    if (!(this.isValidDateValue(dateValue) && this.isInstanceOfDate(dateValue))) return null;
    if (this.isValidDateValue(dateValue) && !this.isInstanceOfDate(dateValue)) return this.createDateFromValue(dateValue);
    if (!this.isValidDateValue(dateValue) && this.isInstanceOfDate(dateValue)) return dateValue
  }

  format() {}

  formatAsDateString(date) {
    const formatter = new Intl.DateTimeFormat(this.LOCALE)
    // const date = this.normalizeDateValue(dateValue);
    return formatter.format(date);
  }

  createDateFromValue(dateValue = null) {
    if (dateValue === null || !this.isValidDateValue(dateValue)) return;
    return new Date(Date.parse(dateValue));
  }

  daysInMonth(month = new Date().getMonth(), year = new Date().getFullYear()) {
    //TODO Needs to take dateValue as param and get year and month from that
    return new Date(year, month, 0).getDate();
  }

  getNameOfTimeUnit(dateValue, unit = 'month', format = 'long') {
    const formatter = new Intl.DateTimeFormat(this.LOCALE, {
      [unit]: format
    });
    // const date = this.normalizeDateValue(dateValue);
    return formatter.format(dateValue).toLowerCase();
  }
}


const getDayName2 = () => {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
  const day = formatter.format(new Date(Date.parse('09/11/21')));
  return day
}
// console.log('getDayName2', getDayName2())


//TODO loop while <= daysInMonth to create
// Day Objects containing: 
// name, WeekOfMonth, dayOfMonth, DayOfWeek, 
// hasOccurred, hasEvent

const date = new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738));
// Results below assume UTC timezone - your results may vary

// Specify default date formatting for language (locale)
// console.log(new Intl.DateTimeFormat('en-US').format(date));
// expected output: "12/20/2020"

// Specify default date formatting for language with a fallback language (in this case Indonesian)
// console.log(new Intl.DateTimeFormat(['ban', 'id']).format(date));
// expected output: "20/12/2020"

// Specify date and time format using "style" options (i.e. full, long, medium, short)
// console.log(new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(date));
// Expected output "Sunday, 20 December 2020 at 14:23:16 GMT+11"


// console.log(new Intl.DateTimeFormat('en-GB', {
//   hour: 'numeric',
//   hourCycle: 'h12',
//   dayPeriod: 'short',
//   timeZone: 'UTC'
// }).format(date));
// > 4 at night"  (same formatting in en-GB for all dayPeriod values)

let o1 = new Intl.DateTimeFormat("en", {
  timeStyle: "short"
});
// console.log(o1.format(Date.now())); // "13:31 AM"

let o2 = new Intl.DateTimeFormat("en", {
  dateStyle: "short"
});
// console.log(o2.format(Date.now())); // "07/07/20"

let o3 = new Intl.DateTimeFormat("en", {
  timeStyle: "medium",
  dateStyle: "short"
});
// console.log(o3.format(Date.now())); // "07/07/20, 13:31:55 AM"


// console.log(new Intl.DateTimeFormat('en-GB', {
//   hour: 'numeric',
//   hourCycle: 'h12',
//   dayPeriod: 'short',
//   timeZone: 'UTC'
// }).format(date));
// > 4 at night"  (same formatting in en-GB for all dayPeriod values)

// console.log(new Intl.DateTimeFormat('fr', {
//   hour: 'numeric',
//   hourCycle: 'h12',
//   dayPeriod: 'narrow',
//   timeZone: 'UTC'
// }).format(date));
// > "4 mat."  (same output in French for both narrow/short dayPeriod)

// console.log(new Intl.DateTimeFormat('fr', {
//   hour: 'numeric',
//   hourCycle: 'h12',
//   dayPeriod: 'long',
//   timeZone: 'UTC'
// }).format(date));
// > "4 du matin"


{ DateService }