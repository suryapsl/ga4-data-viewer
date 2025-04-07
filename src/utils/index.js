export function scrollOnHtmlFast(offsetTop) {
  const htmlElement = document.querySelector('html');
  const bodyElement = document.querySelector('body'); // for safari browser
  htmlElement.scrollTop = offsetTop;
  bodyElement.scrollTop = offsetTop;
}
