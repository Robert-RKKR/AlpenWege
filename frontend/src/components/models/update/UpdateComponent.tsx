// Application imports:
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { BaseApi } from "../../../services/api/baseApi";

// React imports:
import { useEffect, useState } from "react";

// Import component css:
import "./UpdateComponent.css";

// Helpers functions:
function resolvePath(obj: any, path?: string[]) {
  if (!obj || !path) return "";
  return path.reduce((acc, key) => acc?.[key], obj);
}

function setPath(obj: any, path: string[], value: any) {
  const copy = { ...obj };
  let current = copy;

  for (let i = 0; i < path.length - 1; i++) {
    current[path[i]] = { ...(current[path[i]] ?? {}) };
    current = current[path[i]];
  }

  current[path[path.length - 1]] = value;
  return copy;
}

// Properties:
type EditableField = {
  key: string;
  label: string;
  value: string[];
  editable?: boolean;
  type?: "text" | "number";
  suffix?: string;
};

type ObjectEditConfig = {
  api: {
    listUrl: string;
  };
  image: EditableField;
  title: EditableField;
  properties?: EditableField[];
  chapters: {
    title: string;
    properties: EditableField[];
  }[];
};

type Props<T> = {
  config: ObjectEditConfig;
};

// ObjectUpdateComponent component:
export function ObjectUpdateComponent<T>({ config }: Props<T>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({});
  const [activeChapter, setActiveChapter] = useState(0);

  /* Load */
  const { data, isLoading, error } = useQuery<T>({
    queryKey: [config.api.listUrl, id],
    queryFn: () => BaseApi.retrieve<T>(`${config.api.listUrl}${id}/`),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  /* Save (PATCH) */
  const saveMutation = useMutation({
    mutationFn: (payload: Partial<T>) =>
      BaseApi.update<T>(`${config.api.listUrl}${id}/`, payload),
    onSuccess: () => navigate(-1),
  });

  // Render:
  return (
    <div className="object-details">
      {/* ================= HEADER ================= */}
      <div className="object-details-title object-details-card card-box">
        {config.title && (
          <>
            <label className="object-details-title-label">
              {config.title.label}
            </label>

            {config.title.editable ? (
              <input
                className="object-details-title-input"
                type={config.title.type ?? "text"}
                value={resolvePath(formData, config.title.value)}
                onChange={(e) =>
                  setFormData(
                    setPath(
                      formData,
                      config.title.value,
                      e.target.value,
                    ),
                  )
                }
              />
            ) : (
              <h1>{resolvePath(formData, config.title.value)}</h1>
            )}
          </>
        )}
      </div>

      {/* Status */}
      {isLoading && (
        <div className="object-details-card card-box">
          Loading…
        </div>
      )}

      {!isLoading && error && (
        <div className="object-details-card card-box">
          Failed to load data
        </div>
      )}

      {/* BODY */}
      {!isLoading && !error && (
        <div className="object-details-container">
          {/* Lest */}
          <div className="object-details-left">
            {config.image && (
              <div className="object-details-gallery object-details-card card-box">
                {resolvePath(formData, config.image.value) && (
                  <img
                    src={resolvePath(formData, config.image.value)}
                    alt={config.image.label}
                  />
                )}
              </div>
            )}

            {config.chapters && (
              <div className="object-details-chapters object-details-card card-box">
                <div className="object-details-tabs">
                  {config.chapters.map((c, i) => (
                    <button
                      key={i}
                      className={`object-details-tab ${
                        i === activeChapter ? "active" : ""
                      }`}
                      onClick={() => setActiveChapter(i)}
                      type="button"
                    >
                      {c.title}
                    </button>
                  ))}
                </div>

                <div className="object-details-tab-content">
                  {config.chapters[activeChapter]?.properties.map(
                    (p, i) => (
                      <div
                        key={i}
                        className="object-details-property-row"
                      >
                        <span className="label">{p.label}</span>
                        {p.editable ? (
                          <input
                            type={p.type ?? "text"}
                            value={resolvePath(formData, p.value)}
                            onChange={(e) =>
                              setFormData(
                                setPath(
                                  formData,
                                  p.value,
                                  e.target.value,
                                ),
                              )
                            }
                          />
                        ) : (
                          <span className="value">
                            {`${resolvePath(formData, p.value)}${p.suffix ?? ""}`}
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="object-details-right">
            {config.properties && (
              <div className="object-details-properties object-details-card card-box">
                {config.properties.map((p, i) => (
                  <div key={i}>
                    <strong>{p.label}:</strong>{" "}
                    {p.editable ? (
                      <input
                        type={p.type ?? "text"}
                        value={resolvePath(formData, p.value)}
                        onChange={(e) =>
                          setFormData(
                            setPath(
                              formData,
                              p.value,
                              e.target.value,
                            ),
                          )
                        }
                      />
                    ) : (
                      `${resolvePath(formData, p.value)}${p.suffix ?? ""}`
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="object-details-card card-box">
              <button
                type="button"
                className="object-details-button"
                onClick={() => saveMutation.mutate(formData)}
              >
                Save
              </button>
              <button
                type="button"
                className="object-details-button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
