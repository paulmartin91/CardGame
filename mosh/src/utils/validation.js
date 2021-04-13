import React from 'react';
import Joi, { schema } from 'joi-browser'

const validate = (data, schema) => {
  const { error } = Joi.validate(data, schema)
  if (!error) return null
  const tempErrors = {}
  error.details.forEach(item => tempErrors[item.path[0]] = item.message)
  return tempErrors
}

export {validate}