import './Input.css';

const Input = ({ label, optional, error, ...props }) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {optional && <span className="input-optional"> (optional)</span>}
        </label>
      )}
      {props.type === 'textarea' ? (
        <textarea className={`input-field ${error ? 'input-error' : ''}`} {...props} />
      ) : (
        <input className={`input-field ${error ? 'input-error' : ''}`} {...props} />
      )}
      {error && <span className="input-err-msg">{error}</span>}
    </div>
  );
};

export default Input;