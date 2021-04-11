export default (search = '') => new RegExp(`(${search.replace(/[^\w-\s]/g, '.').split(/\s+/g).join(')|(')})`, 'i');
