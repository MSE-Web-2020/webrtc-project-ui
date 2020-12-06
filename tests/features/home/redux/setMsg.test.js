import {
  HOME_SET_MSG,
} from '../../../../src/features/home/redux/constants';

import {
  setMsg,
  reducer,
} from '../../../../src/features/home/redux/setMsg';

describe('home/redux/setMsg', () => {
  it('returns correct action by setMsg', () => {
    expect(setMsg()).toHaveProperty('type', HOME_SET_MSG);
  });

  it('handles action type HOME_SET_MSG correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_MSG }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
