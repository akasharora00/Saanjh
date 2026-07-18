import { forwardRef } from "react";

const InputField = forwardRef(
  (
    {
      label,
      icon: Icon,
      type = "text",
      name,
      value,
      placeholder,
      onChange,
      required = false,
      disabled = false,
    },
    ref
  ) => {
    return (
      <div className="mb-5">
        {/* Label */}
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {label}
        </label>

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {Icon && (
            <Icon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
            />
          )}

          <input
            ref={ref}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`
              w-full
              rounded-xl
              border
              border-slate-800/80
              bg-slate-950/40
              py-3.5
              ${Icon ? "pl-11" : "pl-4"}
              pr-4
              text-slate-100
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-200
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-500/10
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-sm
              font-medium
            `}
          />
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;