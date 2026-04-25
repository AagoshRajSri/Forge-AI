import {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
} from "react";
import type { Project } from "../types";
import { iframeScript } from "../assets/assets";
import EditorPanel from "./EditorPanel";
import LoaderSteps from "./LoaderSteps";

interface ProjectPreviewProps {
  project: Project;
  isGenerating: boolean;
  device?: "phone" | "tablet" | "desktop";
  showEditorPanel?: boolean;
}
export interface ProjectPreviewRef {
  getCode: () => string | undefined;
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(
  ({ project, isGenerating, showEditorPanel = true }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedElement, setSelectedElement] = useState<any>(null);

    useImperativeHandle(ref, () => ({
      getCode: () => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return undefined;
        doc.querySelectorAll(".ai-selected-element, [data-ai-selected]").forEach(el => {
          el.classList.remove("ai-selected-element");
          el.removeAttribute("data-ai-selected");
          (el as HTMLElement).style.outline = "";
        });
        doc.getElementById("ai-preview-style")?.remove();
        doc.getElementById("ai-preview-script")?.remove();
        return doc.documentElement.outerHTML;
      },
    }));

    useEffect(() => {
      const handler = (event: MessageEventInit) => {
        if (event.data.type === "ELEMENT_SELECTED") setSelectedElement(event.data.payload);
        else if (event.data.type === "CLEAR_SELECTION") setSelectedElement(null);
      };
      window.addEventListener("message", handler);
      return () => window.removeEventListener("message", handler);
    }, []);

    const handleUpdate = (updates: any) => {
      iframeRef.current?.contentWindow?.postMessage({ type: "UPDATE_ELEMENT", payload: updates }, "*");
    };

    const injectPreview = (html: string) => {
      if (!html) return "";
      if (!showEditorPanel) return html;
      return html.includes("</body>")
        ? html.replace("</body>", iframeScript + "</body>")
        : html + iframeScript;
    };

    return (
      <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              className="w-full h-full border-none transition-opacity duration-300"
              style={{ opacity: 1 }}
              title="Site preview"
            />
            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedElement(null);
                  iframeRef.current?.contentWindow?.postMessage({ type: "CLEAR_SELECTION_REQUEST" }, "*");
                }}
              />
            )}
          </>
        ) : (
          isGenerating && <LoaderSteps />
        )}
      </div>
    );
  }
);

export default ProjectPreview;
