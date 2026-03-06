import { updateTableData } from "@/utilities/services/supabaseService";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const API_ENDPOINT = "https://api.example.com/configs";
const DEFAULT_FORM_DATA = { key_name: "", description: "", content_json: "" };

function normalizeModalData(data) {
  if (!data) return DEFAULT_FORM_DATA;
  return {
    key_name: data.key_name ?? "",
    description: data.description ?? "",
    content_json:
      data.content_json && typeof data.content_json === "object"
        ? JSON.stringify(data.content_json, null, 2)
        : (data.content_json ?? ""),
  };
}

function JsonLineNumbers({ value }) {
  const lines = value ? value.split("\n").length : 1;
  return (
    <div className="select-none text-right pr-3 pt-3 font-mono text-xs leading-6 text-slate-500 min-w-[2.5rem]">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i + 1}>{i + 1}</div>
      ))}
    </div>
  );
}

export default function ConfigForm({
  isEdit = false,
  modalData = null,
  onCloseModal,
}) {
  const [formData, setFormData] = useState(
    isEdit ? normalizeModalData(modalData) : DEFAULT_FORM_DATA,
  );
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formatError, setFormatError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm({ defaultValues: formData, mode: "onTouched" });

  const contentJsonValue = watch("content_json");

  useEffect(() => {
    const normalized = isEdit
      ? normalizeModalData(modalData)
      : DEFAULT_FORM_DATA;
    setFormData(normalized);
    reset(normalized);
    setSubmitStatus(null);
    setApiError("");
    setFormatError(false);
  }, [isEdit, modalData]);

  const validateJson = (value) => {
    if (!value || !value.trim()) return "Content JSON is required";
    try {
      JSON.parse(value);
      return true;
    } catch {
      return "Must be valid JSON (check syntax, missing brackets, or trailing commas)";
    }
  };

  const handleFormatJson = () => {
    // ✅ getValues() reads the current field value at call time — no stale closure issues
    const raw = getValues("content_json");
    if (!raw || !raw.trim()) return;
    try {
      const formatted = JSON.stringify(JSON.parse(raw), null, 2);
      setValue("content_json", formatted, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setFormatError(false);
    } catch {
      setFormatError(true);
      setTimeout(() => setFormatError(false), 1500);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setApiError("");
    try {
      const payload = {
        key_name: data.key_name.trim(),
        // description: data.description.trim(),
        content_json: JSON.parse(data.content_json),
      };
      setFormData({
        key_name: data.key_name.trim(),
        description: data.description.trim(),
        content_json: data.content_json,
      });

      const result = await updateTableData({
        tableName: "content_master",
        match: { id: modalData?.id },
        payload,
      });

      if (result.status) {
        setSubmitStatus("success");
      } else {
        console.error("Error:", result.error);
      }

      // setSubmitStatus("status");
      if (!isEdit) {
        setFormData(DEFAULT_FORM_DATA);
        reset(DEFAULT_FORM_DATA);
      }
      onCloseModal?.();
    } catch (err) {
      setSubmitStatus("error");
      setApiError(err.message || "Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const restored = isEdit ? normalizeModalData(modalData) : DEFAULT_FORM_DATA;
    setFormData(restored);
    reset(restored);
    setSubmitStatus(null);
    setApiError("");
    setFormatError(false);
  };

  const fieldBase =
    "w-full rounded-lg border px-4 py-2.5 text-sm font-mono transition-all duration-150 outline-none bg-slate-900 text-slate-100 placeholder-slate-500";

  const fieldClass = (hasError, isDirty) =>
    [
      fieldBase,
      hasError
        ? "border-rose-500 ring-1 ring-rose-500/40 focus:ring-rose-500/60"
        : isDirty
          ? "border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
          : "border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30",
    ].join(" ");

  const jsonBorderClass = (hasError, isDirty) =>
    [
      "flex rounded-lg border overflow-hidden transition-all duration-150",
      hasError
        ? "border-rose-500 ring-1 ring-rose-500/40"
        : isDirty
          ? "border-emerald-500/60"
          : "border-slate-700 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/30",
    ].join(" ");

  return (
    <div className="bg-slate-900/80 backdrop-blur shadow-2xl shadow-slate-950/80">
      <div className="px-8 py-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* key_name */}
          <div>
            <label className="block mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Key Name
              </span>
              <span className="ml-1 text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. app.feature.flag"
              className={fieldClass(errors.key_name, dirtyFields.key_name)}
              {...register("key_name", {
                required: "Key name is required",
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Cannot exceed 100 characters",
                },
                // pattern: {
                //   value: /^[a-zA-Z0-9._-]+$/,
                //   message:
                //     "Only letters, numbers, dots, dashes, and underscores allowed",
                // },
              })}
            />
            {errors.key_name && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <span>⚠</span> {errors.key_name.message}
              </p>
            )}
          </div>

          {/* description */}
          {/* <div>
            <label className="block mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Description
              </span>
              <span className="ml-1 text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Briefly describe what this configuration controls..."
              className={`${fieldClass(errors.description, dirtyFields.description)} resize-none leading-relaxed`}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Must be at least 10 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Cannot exceed 500 characters",
                },
              })}
            />
            {errors.description ? (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <span>⚠</span> {errors.description.message}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-600">
                {watch("description")?.length || 0} / 500
              </p>
            )}
          </div> */}

          {/* content_json */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Content JSON
                </span>
                <span className="ml-1 text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleFormatJson}
                className={[
                  "flex items-center gap-1.5 rounded-md border text-xs font-mono px-2.5 py-1 transition-all duration-150",
                  formatError
                    ? "border-rose-500/60 bg-rose-500/10 text-rose-400"
                    : "border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-sky-500/50 text-slate-400 hover:text-sky-300",
                ].join(" ")}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h10M4 14h13M4 18h7"
                  />
                </svg>
                {formatError ? "Invalid JSON" : "Format JSON"}
              </button>
            </div>

            {/* <JsonLineNumbers value={contentJsonValue} /> */}
            <div
              className={jsonBorderClass(
                errors.content_json,
                dirtyFields.content_json,
              )}
            >
              <textarea
                rows={8}
                placeholder={'{\n  "enabled": true,\n  "value": 42\n}'}
                spellCheck={false}
                className="flex-1 h-[120px] overflow-y-auto bg-slate-900 text-slate-100 placeholder-slate-600 font-mono text-sm leading-6 px-3 py-3 outline-none resize-none"
                {...register("content_json", { validate: validateJson })}
              />
            </div>
            {errors.content_json && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <span>⚠</span> {errors.content_json.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
            >
              {isEdit ? "Restore original" : "Reset form"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 transition-all duration-150 shadow-lg shadow-sky-900/40"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  <span>{isEdit ? "Update Config" : "Submit Config"}</span>
                  <span className="text-sky-300">→</span>
                </>
              )}
            </button>
          </div>
          {submitStatus === "success" && (
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <span className="text-emerald-400">✓</span>
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  Configuration {isEdit ? "updated" : "saved"}
                </p>
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3">
              <span className="mt-0.5 text-rose-400">✕</span>
              <div>
                <p className="text-sm font-medium text-rose-300">
                  Submission failed
                </p>
                <p className="text-xs text-rose-400 mt-0.5">{apiError}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
