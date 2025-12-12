// src/components/Alert.jsx
const variants = {
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200",
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200",
};

export default function Alert({ variant = "info", children, onClose }) {
  const isError = variant === "error";
  const role = isError ? "alert" : "status";
  const live = isError ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={live}
      className={`mb-4 flex items-start justify-between gap-4 rounded-md border px-4 py-3 text-sm ${variants[variant]}`}
    >
      <div className="flex-1">{children}</div>

      {typeof onClose === "function" && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md px-2 py-1 text-xs opacity-80 ring-1 ring-transparent transition hover:opacity-100 focus:outline-none focus:ring-current"
          aria-label="Close alert"
          title="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}
