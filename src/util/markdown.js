/* eslint-disable global-require */
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

export const toMd = (value = '') => {
  if (!process.client) return '';
  const turndownService = new window.TurndownService({
    headingStyle: 'atx',
  });
  return turndownService.turndown(value);
};
export const fromMd = (value = '') => sanitizeHtml(
  marked(value, { breaks: true }),
  { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']) },
)
  .replace(/<a([^>]*)>/g, '<a target="_blank" $1>')
  .replace(/<img([^>]*)>/g, '<div style="text-align: center;"><img style="max-width: 95%;" $1></div>');
