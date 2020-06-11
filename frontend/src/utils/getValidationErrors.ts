import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const ValidationErros: Errors = {};
  err.inner.forEach((error) => {
    ValidationErros[error.path] = error.message;
  });
  return ValidationErros;
}
