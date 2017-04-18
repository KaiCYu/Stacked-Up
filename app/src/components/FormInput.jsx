import React from 'react'

const FormInput = (props) => (

  <label>{props.title}
    <input type={props.type} value={props.value} name={props.name} placeholder={props.placeholder} onChange={props.onChange} />
  </label>
);

export default FormInput;

