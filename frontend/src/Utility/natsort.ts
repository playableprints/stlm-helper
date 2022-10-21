export default new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
}).compare;
