import type { ComponentProps, FC } from 'react';
import styles from './Button.module.css';

interface IButtonProps extends ComponentProps<'button'> {
  label: string;
}

const Button: FC<IButtonProps> = ({ label, ...props }) => {
  return (
    <button className={styles.button} {...props}>
      {label}
    </button>
  );
};

export default Button;
