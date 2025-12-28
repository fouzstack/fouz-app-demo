import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';

type colors =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | undefined;

type GenericRegister<K extends string> = {
  [key in K]: string;
};

export interface InputProps<key extends string> {
  type?: string;
  color: colors;
  placeholder?: string;
  label: Path<GenericRegister<key>>;
  register: UseFormRegister<GenericRegister<key>>;
  errors: FieldErrors<GenericRegister<key>>;
}
