import { useAppDispatch, useAppSelector } from './app/hooks.ts';
import { increment, selectCount } from './features/counter/counterSlice.ts';

export default function App() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <main>
      <h1>workinabox</h1>
      <p>count: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
    </main>
  );
}
