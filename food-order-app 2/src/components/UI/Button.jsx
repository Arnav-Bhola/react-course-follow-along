export default function Button({ children, textOnly, className = "", ...props }) {
  var cssClasses = textOnly ? "text-button" : "button";
  cssClasses += " " + className;

  return (
    <button
      className={cssClasses}
      {...props}
    >
      {children}
    </button>
  );
}
