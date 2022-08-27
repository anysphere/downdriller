//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect, useState } from "react";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { classNames } from "./utils";

import { OpenAIApi, CreateCompletionResponse } from "openai";

const theme = {};

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

export function EditorComp({
  className,
  editorRef,
}: {
  className?: string;
  editorRef: MutableRefObject<Editor | null>;
}): JSX.Element {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        protocols: ["http", "https", "mailto"],
      }),
    ],
    content: "<p>Hello World!</p>",
    editorProps: {
      attributes: {
        class:
          "leading-normal prose prose-sm prose-stone focus:outline-none p-2 mx-auto rounded-md overflow-auto focus:ring-2 focus:ring-indigo-500 h-[calc(100vh-4rem)] bg-blue-100 prose-p:mt-0 prose-p:mb-0",
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
