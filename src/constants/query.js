export const queryTypes = {
  'lt': '<',
  'le': '<=',
  'eq': '=',
  'ge': '>=',
  'gt': '>',
  'like': 'like'
};

export const briefQueryTypes = {
  GREATER: '>',
  EQUAL: '=',
  LESS: '<',
  GREATER_EQUAL: '>=',
  LESS_EQUAL: '<=',
};

export const logicTypes = {
  and: 'and',
  or: 'or'
};

export const conditionTypes = {
  'multi': '组合',
  'single': '单句'
};

export default {
  queryTypes,
  briefQueryTypes,
  logicTypes,
  conditionTypes
};
