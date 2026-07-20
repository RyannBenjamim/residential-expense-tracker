import styles from './styles.module.css';

export type Option = {
  value: string | number;
  label: string;
};

type SelectGroupProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

const InputSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção',
  required = false,
  disabled = false,
}: SelectGroupProps) => {
  const isPlaceholderSelected = value === '' || value === undefined;

  return (
    <div className={styles.input_group}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        data-is-placeholder={isPlaceholderSelected}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;