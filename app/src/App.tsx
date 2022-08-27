import { Fragment, useState } from "react";
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
import { useRef } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function App() {
  const editorStateRef = useRef<EditorState>(null);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-500">
      <div className="px-2 py-2 bg-green-100">
        <Editor className="w-full" editorStateRef={editorStateRef} />
      </div>
    </div>
  );
}

export default App;
