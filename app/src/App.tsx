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
import { $getRoot, EditorState } from "lexical";
import { useRef, useEffect, useState } from "react";
import { CmdK } from "./CmdK/CmdK";
import { Configuration, OpenAIApi } from "openai";

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
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai: OpenAIApi = new OpenAIApi(configuration);

  useEffect(() => {
    const openaicall = async (prompt: string) => {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response);
    };

    // const cmdenter = (e: KeyboardEvent) => {
    //   if (e.key === "Enter" && e.metaKey) {
    //     let content = "";
    //     editor.getEditorState().read(() => {
    //       content = $getRoot().getTextContent();
    //     });
    //     void openaicall(content);
    //     e.preventDefault();
    //   }
    // };

    // document.addEventListener("keydown", cmdenter);
    // return () => document.removeEventListener("keydown", cmdenter);

    return;
  });

  return (
    <>
      <CmdK />
      <div className="absolute top-0 left-0 right-0 bottom-0 h-screen w-screen">
        <Editor
          className="h-[calc(100%-1rem)]"
          editorStateRef={editorStateRef}
          openai={openai}
        />
      </div>
    </>
  );
}

export default App;
