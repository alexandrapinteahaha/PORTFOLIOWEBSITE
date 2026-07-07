"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadSubscriberFile } from "./actions";

type UploadState = { error?: string; success?: boolean } | null;

export function FileUploadForm() {
  const [state, formAction, pending] = useActionState<UploadState, FormData>(
    uploadSubscriberFile,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 max-w-md">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Title / filename slug</span>
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. January 2025 Digital Print"
          className="focus-ring min-h-10 border border-line bg-paper px-3 text-sm"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">
          File{" "}
          <span className="text-graphite font-normal">(image or PDF, max 10 MB)</span>
        </span>
        <input
          name="file"
          type="file"
          required
          accept="image/*,.pdf"
          className="focus-ring text-sm file:mr-3 file:border-0 file:bg-chalk file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-widest hover:file:bg-mist"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring min-h-10 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite disabled:opacity-60"
      >
        {pending ? "Uploading…" : "Upload File"}
      </button>
      {state?.error && <p className="text-sm text-rust">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-moss">
          File uploaded — subscribers can now download it.
        </p>
      )}
    </form>
  );
}
