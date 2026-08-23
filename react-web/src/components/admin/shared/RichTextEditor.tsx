import { useEffect, useRef } from "react";
import { Bold, Italic, Link, List, ListOrdered, RemoveFormatting } from "lucide-react";
import { Button } from "../ui/Button";

export function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const editor = useRef<HTMLDivElement>(null);
  const normalizedValue = value.replace(/\s(?:style|class|width)=("[^"]*"|'[^']*')/gi, "");
  useEffect(() => { if (editor.current && editor.current.innerHTML !== normalizedValue) editor.current.innerHTML = normalizedValue; }, [normalizedValue]);
  const command = (name: string, commandValue?: string) => {
    editor.current?.focus(); document.execCommand(name, false, commandValue); onChange(editor.current?.innerHTML ?? "");
  };
  const addLink = () => { const url = window.prompt("Enter the link URL"); if (url) command("createLink", url); };
  return <div className="min-w-0 max-w-full overflow-hidden rounded-md border border-input bg-surface focus-within:ring-2 focus-within:ring-ring/40">
    <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-1.5">
      <Button size="iconSm" variant="ghost" onClick={() => command("bold")} aria-label="Bold"><Bold className="h-3.5 w-3.5" /></Button>
      <Button size="iconSm" variant="ghost" onClick={() => command("italic")} aria-label="Italic"><Italic className="h-3.5 w-3.5" /></Button>
      <Button size="iconSm" variant="ghost" onClick={() => command("insertUnorderedList")} aria-label="Bullet list"><List className="h-3.5 w-3.5" /></Button>
      <Button size="iconSm" variant="ghost" onClick={() => command("insertOrderedList")} aria-label="Numbered list"><ListOrdered className="h-3.5 w-3.5" /></Button>
      <Button size="iconSm" variant="ghost" onClick={addLink} aria-label="Add link"><Link className="h-3.5 w-3.5" /></Button>
      <Button size="iconSm" variant="ghost" onClick={() => command("removeFormat")} aria-label="Clear formatting"><RemoveFormatting className="h-3.5 w-3.5" /></Button>
    </div>
    <div ref={editor} contentEditable suppressContentEditableWarning data-placeholder={placeholder} onInput={(event) => onChange(event.currentTarget.innerHTML)} className="min-h-28 min-w-0 max-w-full whitespace-pre-wrap break-words px-3 py-2 text-sm text-foreground outline-none [overflow-wrap:anywhere] empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] [&_*]:!max-w-full [&_*]:!whitespace-pre-wrap [&_*]:break-words [&_*]:[overflow-wrap:anywhere] [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc" />
  </div>;
}
