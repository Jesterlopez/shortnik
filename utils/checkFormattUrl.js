export const checkFormattUrl = (url) => {
  // create regex to compare the format of the url
  
  const regex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/g
  return regex.test(url);
}