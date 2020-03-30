import { differenceInYears, isDate, isFuture, isValid, parseJSON } from 'date-fns';

export const isValidDate = (dateStr: string): boolean =>  {
  const date = parseJSON(dateStr);
  return isDate(date) && isValid(date) && !isFuture(date) && differenceInYears(Date.now(), date) < 150;
};
