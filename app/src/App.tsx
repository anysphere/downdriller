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
    <>
      <Editor focused={true} editorStateRef={editorStateRef} />
    </>
  );
}

export default App;
