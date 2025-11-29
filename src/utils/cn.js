/**
 * className utility - combines and filters class names
 * Extracted from AccordionTable.jsx for reuse
 *
 * @param {...(string|undefined|null|false)} classes - Class names to combine
 * @returns {string} Combined class string
 */
export const cn = (...classes) => classes.filter(Boolean).join(' ');
