import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';;
const { of , interval, fromEvent, merge, empty } = rxjs;
const { fromFetch } = rxjs.fetch;
const { take,switchMap, distinct,tap, mergeMap, scan, takeWhile, startWith, map, mapTo } = rxjs.operators;

class CalParser {
  constructor() {}

  fetch(url) {
    return fromFetch(url).pipe(
      mergeMap((response) => response.text()),
      map(x => x)
    )
  }

  stripLineBreaks(text) {
    const reggie = /m:(\s\r?\n)|(\r?\n\s)/g;
    const str = text.replace(reggie, '')
    return str.replace(/(;VALUE=DATE:)/g, '')
  }

  // Unused?
  getLengthBetweenKeys(text, currentPosition) {
    raw.indexOf('END:VEVENT', currentPosition) - 1;
  }

  hyphenate(text) {
    return [4, 6, 11, 13]
      .reduce((newString, int, index, arr) => {
        const intNeg = int - text.length;
        if (newString.length === 0) newString = text;
        return `${newString.slice(0, intNeg)}${index <= 1 ? '-' : ':'}${newString.slice(intNeg)}`;
      }, '');
  }

  parseICS(ics$) {
    return ics$.pipe(
      // take(1), TODO Double fetch not happenjng here
      map(str => {
        const raw = this.stripLineBreaks(str).normalize();
        let beginIndex = raw.indexOf('BEGIN:VEVENT');
        let endIndex = raw.indexOf('END:VEVENT');
        let days = []

        while (beginIndex !== -1) {
          endIndex = raw.indexOf('END:VEVENT', beginIndex) - 1;
          days = [...days, raw.substring(beginIndex, endIndex).split('\r\n')
            .reduce((dayObj, props) => {
              let [key, value] = [props.substring(0, props.indexOf(':')), props.substring(props.indexOf(':') + 1)]
            
              key = key === 'LAST-MODIFIED' ? 'LASTMODIFIED' : key;
              value = key.startsWith('DT') || ['LASTMODIFIED', 'CREATED'].includes(key) ? new Date(Date.parse(this.hyphenate(value))) : value;
            
              return { ...dayObj, [key === 'BEGIN' ? 'TYPE' : key]: value }
            }, {})];
          beginIndex = raw.indexOf('BEGIN:VEVENT', endIndex + 'END:VEVENT'.length + 1);
        }
        
        return days;
      }),
      distinct(_ => _.UID),
     // take(1)TODO Double fetch not happenjng here
      
      // tap(x => console.log('aftr dist', x))
    )
  }
}

const GROUP_DATA = '/calendar/data/calendar-export/group-calendar.ics';
const JWH_DATA = '/calendar/data/calendar-export/jacobwilsonhamilton@gmail.com.ics';
const calParser = new CalParser();
export default calParser.parseICS(calParser.fetch(JWH_DATA));

// parsedICS$.subscribe(x => console.log('parsedICS$', x))