import type { FC } from 'react';
import styles from './Selector.module.css';
import Select, { type Options } from 'react-select';

type Props = {
  selectorId: string;
  options: Array<object>;
  onSetSelected: (option: Options) => void;
};

export const Selector: FC<Props> = ({ selectorId, options, onSetSelected }) => {
  return (
    <div className={styles.container}>
      <Select
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            height: '38px',
          }),
        }}
        name={selectorId}
        options={options}
        defaultValue={options[0]}
        onChange={(option: Option | null) => {
          onSetSelected(option);
        }}
      />
    </div>
  );
};
