import React from 'react'

const FormInput = (props) => (

  <label>{props.title}
    {/*{console.log('props inside FORM INPUT: ', props)}*/}
    <input type={props.type} value={props.value} name={props.name} placeholder={props.placeholder} onChange={props.onChange} id={props.id}/>
  </label>
);

export default FormInput;

