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
import { EditorComp } from "./Editor";
import { Editor } from "@tiptap/react";
import { $getRoot, EditorState } from "lexical";
import { useRef, useEffect, useMemo, useState } from "react";
import { CmdK } from "./CmdK";
import {
  BaseDirectory,
  createDir,
  writeFile,
  readTextFile,
} from "@tauri-apps/api/fs";
import { Configuration, OpenAIApi } from "openai";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

async function readApiKey() {
  try {
    const contents = await readTextFile(`./apikey.txt`, {
      dir: BaseDirectory.App,
    });
    return contents;
  } catch (e) {
    console.log(e);
  }
}

async function writeApiKey(apikey: string) {
  try {
    await writeFile(
      {
        contents: apikey,
        path: `./apikey.txt`,
      },
      {
        dir: BaseDirectory.App,
      }
    );
  } catch (e) {
    console.log(e);
  }
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

  const editorRef = useRef<Editor>(null);
  const [openai, setOpenai] = useState<OpenAIApi | null>(null);
  useEffect(() => {
    async function fetch() {
      const configuration = new Configuration({
        apiKey: await readApiKey(),
      });
      setOpenai(new OpenAIApi(configuration));
    }
    void fetch();
  }, []);

  useEffect(() => {
    const openaicall = async (prompt: string) => {
      if (openai == null) {
        return;
      }
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const choices = response.data.choices;
      if (choices == null) {
        return;
      }
      const choice = choices[0];
      if (choice == null) {
        return;
      }
      const text = choice.text;
      if (text == null) {
        return;
      }
      const editor = editorRef.current;
      if (editor == null) {
        return;
      }
      editor.chain().insertContent(text).run();
      console.log(text);
    };

    const cmdenter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.metaKey) {
        if (editorRef.current) {
          const content = editorRef.current.getText();
          void openaicall(content);
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", cmdenter);
    return () => document.removeEventListener("keydown", cmdenter);
  });

  return (
    <>
      <CmdK writeOpenAiKey={writeApiKey} />
      <div className="absolute top-0 left-0 right-0 bottom-0 h-screen w-screen">
        <EditorComp className="mt-8" editorRef={editorRef} />
      </div>
    </>
  );
}

export default App;
