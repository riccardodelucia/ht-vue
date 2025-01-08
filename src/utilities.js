export const extractModelValueFromOption = (option) => {
  if (typeof option === 'object' && option?.value) return option.value;
  return option;
};

export const parseOptionLabel = (option) => {
  if (typeof option === 'object' && option?.label) return option.label;
  return option;
};
