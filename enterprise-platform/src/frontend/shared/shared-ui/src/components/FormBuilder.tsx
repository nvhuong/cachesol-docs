import { Form } from 'antd';
import type { FormProps } from 'antd';
import type { ReactNode } from 'react';

interface FormBuilderProps extends FormProps {
  children: ReactNode;
  loading?: boolean;
}

export function FormBuilder({ children, ...rest }: FormBuilderProps) {
  return (
    <Form layout="vertical" {...rest}>
      {children}
    </Form>
  );
}
