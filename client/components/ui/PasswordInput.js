"use client";

import { useState } from "react";
import Input from "./Input";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

function PasswordInput({ placeholder, id, className, label }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        id={id}
        className={className}
        label={label}
      />
      <button
        type="button"
        className="absolute right-2 bottom-0 p-2 text-slate-400 hover:text-slate-700"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff size={24} className="text-slate-400" />
        ) : (
          <Eye size={24} className="text-slate-400" />
        )}
      </button>
    </div>
  );
}

export default PasswordInput;
