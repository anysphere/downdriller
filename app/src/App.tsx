import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Editor } from "./Editor";
import { EditorState } from "lexical";
import { useRef, useEffect, useState } from "react";
import { CmdK } from "./CmdK/CmdK";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function FixMaxPingSound() {
  useEffect(() => {
    const sound = (event: KeyboardEvent) => {
      const ele = event.composedPath()[0];
      if (
        ele instanceof HTMLInputElement ||
        ele instanceof HTMLAreaElement ||
        ele instanceof HTMLDivElement
      )
        return;
      event.preventDefault();
    };
    document.addEventListener("keypress", sound);
    return () => document.removeEventListener("keypress", sound);
  }, []);
}

function App() {
  FixMaxPingSound();
  const editorStateRef = useRef<EditorState>(null);

  return (
    <>
      <CmdK />
      <div className="absolute top-0 left-0 right-0 bottom-0 h-screen w-screen">
        <Editor
          className="h-[calc(100%-1rem)]"
          editorStateRef={editorStateRef}
        />
      </div>
    </>
  );
}

export default App;
