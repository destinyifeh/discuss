import {FC} from 'react';
import {FieldError} from 'react-hook-form';

type InputMessageProps = {
  field: string;
  errorField?: FieldError;
};

export const InputMessage: FC<InputMessageProps> = ({field, errorField}) => {
  return (
    <>
      {errorField && field !== '' && (
        <p className="text-destructive text-sm">{errorField.message}</p>
      )}
    </>
  );
};

export const InputLabel = ({
  label,
  htmlFor,
}: {
  label: string;
  htmlFor: string;
}) => {
  return (
    <label className="text-sm font-medium" htmlFor={htmlFor}>
      {label}
    </label>
  );
};
