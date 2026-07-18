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
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>

      <div className="relative">
        {/* Lock Icon */}
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
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
            border-slate-800/80
            bg-slate-950/40
            py-3.5
            pl-11
            pr-12
            text-slate-100
            placeholder:text-slate-500
            outline-none
            transition-all
            duration-200
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
            text-sm
            font-medium
          "
        />

        {/* Eye Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
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