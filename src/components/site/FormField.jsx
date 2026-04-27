import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = "text", 
  as = "input", // Puede ser "input" o "select"
  formData, 
  touchedFields, 
  isFieldInvalid, 
  isFieldValid, 
  onChange,
  onBlur,
  onFocus,
  children, 
}) => {
  // Lógica de validación centralizada
  const isInvalid = isFieldInvalid(name, formData[name]);
  const isValid = isFieldValid ? isFieldValid(name, formData[name]) : false;
  const isTouched = touchedFields[name];

  const className = `
    ${isTouched ? 'touched' : ''} 
    ${isInvalid ? 'invalid' : ''} 
    ${isValid ? 'valid' : ''}
  `.trim();

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {as === "select" ? (
        <select 
          id={name} 
          name={name} 
          className={className}
          value={formData[name] || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        >
          {children}
        </select>
      ) : (
        <input 
          id={name} 
          name={name} 
          type={type} 
          className={className}
          value={formData[name] || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      )}
    </div>
  );
};

export default FormField;
