import './Button.css';

const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', fullWidth }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;