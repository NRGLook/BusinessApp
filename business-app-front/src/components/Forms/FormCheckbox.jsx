
const FormCheckbox = ({ name, text, onChange, checked }) => (
  <label className='checkbox-container'>
    {text}
    <input
      value='0'
      id={name}
      name={name}
      type='checkbox'
      onChange={onChange}
      defaultChecked={checked}
    />
    <span className='checkmark' />
  </label>
);

export default FormCheckbox;
