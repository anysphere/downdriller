//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect, useState } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { OpenAIApi, CreateCompletionResponse } from "openai";

const theme = {};

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };


export function Editor({ className }: { className?: string }): JSX.Element {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-stone sm:prose-stone lg:prose-lg xl:prose-2xl m-5 focus:outline-none mx-auto",
      },
    },
  });

  return (
    <div className={`relative mx-auto`}>
      <EditorContent editor={editor} />
    </div>
  );
}
