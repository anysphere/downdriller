//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect, useState } from "react";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { classNames } from "./utils";
import { Extension } from "@tiptap/core";

import { OpenAIApi, CreateCompletionResponse } from "openai";

const theme = {};

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

export function EditorComp({
  className,
  editorRef,
  openai,
}: {
  className?: string;
  editorRef: MutableRefObject<Editor | null>;
  openai?: OpenAIApi;
}): JSX.Element {
  const OpenAiExtension = Extension.create({
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => {
          const openaicall = async (prompt: string) => {
            if (openai == null) {
              return;
            }
            const response = await openai.createCompletion({
              model: "text-ada-001",
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
          const content = editorRef.current?.getText() ?? "Error message:";
          console.log(content);
          void openaicall(content);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      OpenAiExtension,
      Link.configure({
        openOnClick: false,
        protocols: ["http", "https", "mailto"],
      }),
    ],
    content: "<p>Hello World!</p>",
    editorProps: {
      attributes: {
        class:
          "leading-normal prose prose-sm prose-stone focus:outline-none p-2 mx-auto rounded-md overflow-auto focus:shadow-lg h-[calc(100vh-4rem)] prose-p:mt-0 prose-p:mb-0",
      },
    },
  });
  editorRef.current = editor;

  return (
    <div className={classNames("", className ?? "")}>
      <EditorContent editor={editor} />
    </div>
  );
}
