import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Path } from 'react-hook-form';

type color =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | undefined;

export interface InputGeneric<T extends FieldValues> {
  type?: string;
  color?: color;
  placeholder?: string;
  label: Path<T>;
  errors: FieldErrors<T | any>;
  register: UseFormRegister<T>;
  defaultValue?: string | undefined;
}
