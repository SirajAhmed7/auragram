import { cn } from "@/lib/utils";

function Input({ type = "text", placeholder, id, className, label }) {
  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={id}
        className="text-base font-medium text-slate-600 block"
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={cn(
          "text-base border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 w-full rounded-full py-2 px-4 block max-w-full",
          className
        )}
      />
    </div>
  );
}

export default Input;
