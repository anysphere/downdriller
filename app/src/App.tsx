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
  await createDir("data", {
    dir: BaseDirectory.App,
    recursive: true,
  });

  try {
    const contents = await readTextFile(`data/apikey.txt`, {
      dir: BaseDirectory.App,
    });
    console.log("API Key:", contents);
    return contents;
  } catch (e) {
    console.log(e);
  }
}

async function writeApiKey(apikey: string) {
  await createDir("data", {
    dir: BaseDirectory.App,
    recursive: true,
  });

  try {
    await writeFile(
      {
        contents: apikey,
        path: `data/apikey.txt`,
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
    const cmdenter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.metaKey) {
        e.preventDefault();
        if (editorRef.current) {
          const content = editorRef.current.getText();
          console.log(content);
          void openaicall(content);
        }
      }
    };

    document.addEventListener("keydown", cmdenter);
    return () => document.removeEventListener("keydown", cmdenter);
  });

  return (
    <>
      <CmdK
        writeOpenAiKey={(s: string) => {
          void (async () => {
            await writeApiKey(s);
            const configuration = new Configuration({
              apiKey: await readApiKey(),
            });
            setOpenai(new OpenAIApi(configuration));
          })();
        }}
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 h-screen w-screen">
        <EditorComp
          className="mt-8 mb-8"
          editorRef={editorRef}
          openai={openai ?? undefined}
        />
      </div>
    </>
  );
}

export default App;
