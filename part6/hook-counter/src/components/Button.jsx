import { useContext } from 'react';
import CounterContext from '../CounterContext';

const Button = ({ dispatch, type, label }) => {
  const { counterDispatch } = useContext(CounterContext)
  return (
    <button onClick={() => counterDispatch({ type })}>{label}</button>
  )
};

export default Button;