import React from 'react'
import { Form } from 'react-router-dom'

function FormInput({label, name, type}) {
  return (
    <fieldset className="fieldset">
      <legend className="text-white text-left ">
        {label}
      </legend>
      <input
        type={type}
        className=" w-full"
        name={name}
        placeholder="Type here"
        required
      />
    </fieldset>
)
}

export default FormInput