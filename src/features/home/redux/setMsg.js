import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HOME_SET_MSG,
} from './constants';


export function setMsg(chatMsg) {
  return {
    type: HOME_SET_MSG,
    chatMsg: chatMsg,
  };
}

export function useSetMsg() {
  const dispatch = useDispatch();
  const boundAction = useCallback((...params) => dispatch(setMsg(...params)), [dispatch]);
  return { setMsg: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_MSG:
      return {
        ...state,
        chatMsg: action.chatMsg,
      };

    default:
      return state;
  }
}
