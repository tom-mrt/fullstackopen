import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer';

const FilterText = (props) => {
  const dispatch = useDispatch()

  const style = {
    marginBottom: 10,
    backgroundColor: "red",
  }

  return (
    <div style={style}>
      <label>filter<input type="text" onChange={(e) => dispatch(filterChange(e.target.value))}/></label>
    </div>
  )
};

export default FilterText;