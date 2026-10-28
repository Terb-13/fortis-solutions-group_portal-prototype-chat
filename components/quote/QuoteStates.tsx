import Link from "next/link";

export function QuoteConfigurationError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 px-6 py-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-amber-950">Quote pages not configured</h1>
        <p className="mt-2 text-sm text-amber-900">
          The server is missing the configuration required to load quotes. Contact your administrator.
        </p>
      </div>
    </div>
  );
}

export function QuoteFetchError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg rounded-lg border border-red-200 bg-red-50 px-6 py-8 shadow-sm">
        <h1 className="text-lg font-semibold text-red-950">Could not load quote</h1>
        <p className="mt-2 text-sm text-red-900">
          This may be a temporary problem loading the quote. Try again, or contact your administrator if it
          continues.
        </p>
        <p className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600"
          >
            Back home
          </Link>
        </p>
      </div>
    </div>
  );
}
