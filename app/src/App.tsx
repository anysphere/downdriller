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
  const openai = new OpenAIApi(configuration);
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
      editor.update(() => {
        const root = $getRoot();
        const choices = response.data.choices;
        if (choices == null) {
          return;
        }
        const firstchoice = choices[0];
        if (firstchoice == null) {
          return;
        }
        const text = firstchoice.text;
        if (text == null) {
          return;
        }
        console.log(text);
        const textNode = $createTextNode(text);
        root.append(textNode);
      });
      editor.update(() => {
        const root = $getRoot();
        const children = root.getAllTextNodes();
        if (children.length === 0) {
          const paragraphNode = $createParagraphNode();
          const textNode = $createTextNode("Hello World");
          paragraphNode.append(textNode);
          root.append(paragraphNode);
        } else {
          const textNode = children[children.length - 1];
          textNode.setTextContent(textNode.getTextContent() + " World");
        }
        console.log("Hello World");
      });
    };
    const cmdenter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.metaKey) {
        let content = "";
        editor.getEditorState().read(() => {
          content = $getRoot().getTextContent();
        });
        void openaicall(content);
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", cmdenter);
    return () => document.removeEventListener("keydown", cmdenter);
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
