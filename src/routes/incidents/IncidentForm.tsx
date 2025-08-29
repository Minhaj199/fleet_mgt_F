import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { useState } from "react";
import type { Attachment } from "../../types/type"; 
import {
  DetailsSchema,
  EditExtrasSchema,
  LocationSchema,
  VehicleSchema,
} from "../../utils/zodSchema";
import {
  assignees,
  cars,
  reporters,
  statuses,
  updateTypes,
  updateUsers,
} from "../../data";
import { IncidentFormValues } from "../../types/type";

const severities = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];
const types = [
  { label: "Collision", value: "COLLISION" },
  { label: "Mechanical", value: "MECHANICAL" },
  { label: "Other", value: "OTHER" },
];

async function filesToAttachments(
  files: FileList | null
): Promise<Attachment[]> {
  if (!files) return [];
  const out: Attachment[] = [];
  for (const f of Array.from(files)) {
    const dataUrl = await new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(f);
    });
    out.push({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.type,
      size: f.size,
      dataUrl,
    });
  }
  return out;
}

export default function IncidentForm({
  onSubmit,
  defaultValues,
  isEdit = false,
}: {
  onSubmit: (v: IncidentFormValues) => void;
  defaultValues?: Partial<IncidentFormValues>;
  isEdit?: boolean;
}) {
  const [step, setStep] = useState(0);
  const methods = useForm<IncidentFormValues>({
    resolver: zodResolver(
      DetailsSchema.merge(LocationSchema)
        .merge(VehicleSchema)
        .merge(EditExtrasSchema)
    ),
    defaultValues: { ...defaultValues },
  });
  const next = async () => {
    const sections = [
      DetailsSchema,
      LocationSchema,
      VehicleSchema,
      isEdit ? EditExtrasSchema : null,
    ].filter(Boolean) as z.ZodTypeAny[];
    const data = methods.getValues();
    const parse = sections[step].safeParse(data);
    if (!parse.success) {
      methods.trigger();
      return;
    }
    setStep((s) => Math.min(sections.length - 1, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm">
          {[
            "Incident Details",
            "Location & Time",
            "Vehicle, Files & Cost",
            ...(isEdit ? ["Edit Extras"] : []),
          ].map((label, i) => (
            <div
              key={i}
              className={`px-3 py-1 rounded-full border ${
                i === step ? "bg-primary text-white border-primary" : "bg-white"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {step === 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Title</label>
              <Input
                {...methods.register("title")}
                placeholder="Incident title"
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.title?.message}
              </p>
            </div>
            <div>
              <label className="text-sm">Severity</label>
              <Select
                options={severities}
                placeholder="Select severity"
                value={methods.watch("severity") as any}
                onValueChange={(v) => methods.setValue("severity", v as any)}
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.severity?.message as any}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Description</label>
              <Textarea
                rows={4}
                {...methods.register("description")}
                placeholder="Describe incident"
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.description?.message}
              </p>
            </div>
            <div>
              <label className="text-sm">Type</label>
              <Select
                options={types}
                placeholder="Select type"
                value={methods.watch("incidentType") as any}
                onValueChange={(v) =>
                  methods.setValue("incidentType", v as any)
                }
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.incidentType?.message as any}
              </p>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Location</label>
              <Input {...methods.register("location")} placeholder="Location" />
              <p className="text-xs text-red-600">
                {methods.formState.errors.location?.message}
              </p>
            </div>
            <div>
              <label className="text-sm">Occurred At</label>
              <Input
                type="datetime-local"
                {...methods.register("occurredAt")}
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.occurredAt?.message}
              </p>
            </div>
            <div>
              <label className="text-sm">Latitude</label>
              <Input
                type="number"
                step="any"
                {...methods.register("latitude")}
              />
            </div>
            <div>
              <label className="text-sm">Longitude</label>
              <Input
                type="number"
                step="any"
                {...methods.register("longitude")}
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Car</label>
              <Select
                options={cars}
                placeholder="Select car"
                value={methods.watch("carName") as any}
                onValueChange={(v) => methods.setValue("carName", v as any)}
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.carName?.message}
              </p>
            </div>

            <div>
              <label className="text-sm">Reported By</label>
              <Select
                options={reporters}
                placeholder="Select reporter"
                value={methods.watch("reportedByName") as any}
                onValueChange={(v) =>
                  methods.setValue("reportedByName", v as any)
                }
              />
              <p className="text-xs text-red-600">
                {methods.formState.errors.reportedByName?.message}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm">
                Attachments (images/docs) (max 5)
              </label>
              <Input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xlsx,.txt"
                onChange={async (e) => {
                  const existing =
                    (methods.getValues("attachments") as Attachment[]) || [];
                  if (existing.length >= 5) {
                    alert("You can only upload up to 5 attachments.");
                    return;
                  }

                  const atts = await filesToAttachments(e.target.files);

                  // merge but keep only 5
                  const updated = [...existing, ...atts].slice(0, 5);
                  methods.setValue("attachments", updated);

                  // reset input so the same file can be re-uploaded if removed
                  e.target.value = "";
                }}
              />

              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {(
                  methods.watch("attachments") as Attachment[] | undefined
                )?.map((a, idx, arr) => (
                  <div
                    key={a.id}
                    className="relative border rounded-lg p-2 text-xs bg-white"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => {
                        const updated = arr.filter((_, i) => i !== idx);
                        methods.setValue("attachments", updated);
                      }}
                    >
                      ×
                    </button>

                    {a.type.startsWith("image/") ? (
                      <img
                        src={a.dataUrl}
                        alt={a.name}
                        className="h-24 w-full object-cover rounded"
                      />
                    ) : (
                      <div className="h-24 flex items-center justify-center bg-gray-50 rounded">
                        {a.name}
                      </div>
                    )}
                    <div className="truncate">{a.name}</div>
                  </div>
                ))}
              </div>

              {/* Show warning if max reached */}
              {(methods.watch("attachments")?.length ?? 0) >= 5 && (
                <p className="text-xs text-red-600 mt-1">
                  Maximum 5 attachments allowed.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm">Odometer</label>
              <Input type="number" {...methods.register("odometer")} />
            </div>
            <div>
              <label className="text-sm">Estimated Cost</label>
              <Input type="number" {...methods.register("estimatedCost")} />
            </div>
          </section>
        )}

        {isEdit && step === 3 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Updated By</label>
              <Select
                options={updateUsers}
                placeholder="Select user"
                value={methods.watch("changedBy") as any}
                onValueChange={(v) => methods.setValue("changedBy", v as any)}
              />
            </div>

            <div>
              <label className="text-sm">Update Type</label>
              <Select
                options={updateTypes}
                placeholder="Select type"
                value={methods.watch("updateType") as any}
                onValueChange={(v) => methods.setValue("updateType", v as any)}
              />
            </div>

            <div>
              <label className="text-sm">Assigned To</label>
              <Select
                options={assignees}
                placeholder="Select assignee"
                value={methods.watch("assignedTo") as any}
                onValueChange={(v) => methods.setValue("assignedTo", v as any)}
              />
            </div>

            <div>
              <label className="text-sm">Status</label>
              <Select
                options={statuses}
                placeholder="Select status"
                value={methods.watch("status") as any}
                onValueChange={(v) => methods.setValue("status", v as any)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm">Log message</label>
              <Textarea rows={3} {...methods.register("logMessage")} />
            </div>

            <div>
              <label className="text-sm">Actual Cost</label>
              <Input type="number" {...methods.register("actualCost")} />
            </div>
          </section>
        )}

        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={prev} disabled={step === 0}>
            Back
          </Button>
          {step < (isEdit ? 3 : 2) ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button onClick={methods.handleSubmit(onSubmit)}>Submit</Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
