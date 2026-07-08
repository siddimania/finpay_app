import { toast } from "sonner";
import { CheckCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bug, TriangleAlert } from "lucide-react";

interface ToastProps {
  toastObject: number | string;
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function AppToast({
  toastObject,
  title,
  message,
  icon: Icon,
  color,
}: ToastProps) {
  return (
    <div
      id="toast-default"
      className={cn(
        "flex w-fit items-center gap-4 rounded-lg p-4 shadow-sm",
        color,
      )}
      role="alert"
    >
      <div className="rounded-full bg-white p-2">
        <Icon className="size-6 stroke-black" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <div className="text-base font-bold text-white">{message}</div>
      </div>
      <button
        type="button"
        data-dismiss-target="#toast-default"
        className="cursor-pointer rounded-sm bg-white p-1"
        aria-label="Close"
        onClick={() => toast.dismiss(toastObject)}
      >
        <X className="size-4 stroke-black" />
      </button>
    </div>
  );
}

export function successToast(errorMessage: string | null, duration = 4000) {
  toast.custom(
    (t) => (
      <AppToast
        toastObject={t}
        title="Success !!"
        message={`${errorMessage}`}
        icon={CheckCheck}
        color="bg-green-400"
      />
    ),
    { duration: duration },
  );
}

export function errorToast(errorMessage: string | null, duration = 4000) {
  toast.custom(
    (t) => (
      <AppToast
        toastObject={t}
        title="Error !!"
        message={`${errorMessage}`}
        icon={Bug}
        color="bg-red-400"
      />
    ),
    { duration: duration },
  );
}

export function infoToast(errorMessage: string | null, duration = 4000) {
  toast.custom(
    (t) => (
      <AppToast
        toastObject={t}
        title="Attention !!"
        message={`${errorMessage}`}
        icon={TriangleAlert}
        color="bg-amber-400"
      />
    ),
    { duration: duration },
  );
}
