const matchesFuncName = [
  'matches',
  'webkitMatchesSelector',
  'msMatchesSelector',
].filter((name) => typeof document.documentElement[name] === 'function')[0];

export default function eventMatches(event, selector) {
  // <svg> in IE does not have `Element#msMatchesSelector()`.
  // Also a weird behavior is seen in IE where DOM tree seems broken when `event.target` is on <svg>.
  // Therefore this function simply returns `undefined` when `event.target` is on <svg>.
  if (typeof event.target[matchesFuncName] === 'function') {
    if (event.target[matchesFuncName](selector)) {
      // If event target itself matches the given selector, return it
      return event.target;
    } else if (event.target[matchesFuncName](selector + ' *')) {
      // If event target is a child node of a DOM element that matches the given selector, find the DOM element by going up the DOM tree
      for (let traverse = event.target; traverse && traverse !== event.currentTarget; traverse = traverse.parentNode) {
        if (traverse[matchesFuncName](selector)) {
          return traverse;
        }
      }
    }
  }
}
