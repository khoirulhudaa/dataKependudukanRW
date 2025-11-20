import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "auth" | "default";
  extra?: string;
  label: string;
  id: string;
  state?: "error" | "success";
  disabled?: boolean;
};

export default function InputField(props: InputFieldProps) {
  const {
    variant = "auth",
    extra = "",
    label,
    id,
    state,
    disabled,
    className = "",
    ...rest // ← ini menangkap value, onChange, type, placeholder, dll
  } = props;

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>

      <input
        {...rest} // ← value, onChange, placeholder, type, dll masuk sini
        disabled={disabled}
        id={id}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none transition-all
          ${
            disabled
              ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
              : state === "error"
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
              : state === "success"
              ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
              : "border-gray-400 dark:!border-white/10 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          }
          ${className}`}
      />
    </div>
  );
}