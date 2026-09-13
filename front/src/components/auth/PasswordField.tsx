

export function PasswordField(props: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    autoComplete?: string;
    show: boolean;
    onToggle: () => void;
}) {
    const { label, value, onChange, error, autoComplete, show, onToggle } = props;

    return (
        <div>
            <label className="mb-1 block text-sm font-semibold text-slate-800">
                {label}
            </label>
            <div
                className={[
                    "flex items-center rounded-xl border bg-white shadow-sm",
                    error ? "border-red-300" : "border-slate-200",
                    "focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100",
                    error ? "focus-within:border-red-400 focus-within:ring-red-100" : "",
                ].join(" ")}
            >
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    type={show ? "text" : "password"}
                    autoComplete={autoComplete}
                    className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="mx-2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                    {show ? "숨김" : "보기"}
                </button>
            </div>
            {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </div>
    );
}