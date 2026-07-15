import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-5">

      {/* Label */}

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">

        {/* Lock Icon */}

        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            py-3.5
            pl-11
            pr-12
            outline-none
            transition
            duration-200
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-100
          "
        />

        {/* Eye */}

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>
    </div>
  );
};

export default PasswordInput;