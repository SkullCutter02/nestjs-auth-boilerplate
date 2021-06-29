export const addMillisecondsToNow = (ms: number) => {
  let now = Date.now();
  now += ms;
  return new Date(now);
};
