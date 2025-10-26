import { useState, useImperativeHandle, forwardRef } from "react"

const Togglable = forwardRef(({ buttonLabel, hideLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(v => !v)
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      {!visible && <button onClick={toggleVisibility}>{buttonLabel}</button>}
      {visible && (
        <div>
          {children}
          <button onClick={toggleVisibility}>{hideLabel}</button>
        </div>
      )}
    </div>
  )

  // return (
  //   <div>
  //     <div style={hideWhenVisible}>
  //       <button onClick={toggleVisibility}>{props.buttonLabel}</button>
  //     </div>
  //     <div style={showWhenVisible}>
  //       {props.children}
  //       <button onClick={toggleVisibility}>cancel</button>
  //     </div>
  //   </div>
  // )
});

export default Togglable