export const labelize = (optionLabels, option, idx) => {
  const valueAtIndex = optionLabels.at(idx);
  if (valueAtIndex !== undefined) return optionLabels[idx];
  return option;
};
