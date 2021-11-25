// const app = document.querySelector('.app')
const calendar = document.querySelector('.calendar')

let startX;

const endTouch = (e) => {
  const swipeMin = Math.round(parseInt(getComputedStyle(calendar).width.replace('px', '')) * 0.36)
  const finishingTouch = e.changedTouches[0].clientX

  if (Math.abs((startX - finishingTouch)) < swipeMin) {
    // console.log('Minimum swipe distance not me');
  } else {
    let direction;
    if ((startX - finishingTouch) < 0) {
      // console.log('swiping right');
      direction = 'right';
    } else {
      direction = 'left';
      // console.log('swipping left');
    }
    calendar.dispatchEvent(new CustomEvent('swipe-action', { bubbles: true, detail: { swipeDirection: direction } }))

  }
  calendar.removeEventListener('touchmove', moveTouch)
  calendar.removeEventListener('touchend', endTouch)
}


const moveTouch = (e) => {
  const progressX = startX - e.touches[0].clientX
  const translation = progressX > 0 ?
    parseInt(-Math.abs(progressX)) :
    parseInt(Math.abs(progressX))
}

const startTouch = (e) => {
  const { touches } = e
  if (touches && touches.length === 1) {
    const touch = touches[0]
    startX = touch.clientX
    calendar.addEventListener('touchmove', moveTouch)
    calendar.addEventListener('touchend', endTouch)
  }
}

calendar.addEventListener('touchstart', startTouch)

const addSwipeAction = (el, dir, swipeFunc) => {

}