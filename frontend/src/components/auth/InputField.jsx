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

        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>

        {/* Input */}

        <div className="relative">

          {/* Icon */}

          {Icon && (
            <Icon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
              border-gray-300
              bg-white
              py-3.5
              ${Icon ? "pl-11" : "pl-4"}
              pr-4
              text-gray-700
              placeholder:text-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-violet-500
              focus:ring-4
              focus:ring-violet-100
            `}
          />

        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;