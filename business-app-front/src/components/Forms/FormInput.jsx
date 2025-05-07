

const FormInput = ({ type, name, value, placeholder, onChange, onKeyDown }) => (
  <input
    id={name}
    name={name}
    type={type}
    value={value}
    autoComplete='off'
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
  />
);

export default FormInput;
