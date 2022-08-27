//
// Copyright 2022 Anysphere, Inc.
// SPDX-License-Identifier: GPL-3.0-only
//

import { MutableRefObject, useEffect } from "react";
import {
  $createTextNode,
  $createParagraphNode,
  $getRoot,
  EditorState,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalEditor } from "lexical/LexicalEditor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OpenAIApi, CreateCompletionResponse } from "openai";

const theme = {};

function OpenAIPlugin({ openai }: { openai: OpenAIApi }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const openaicall = async (prompt: string) => {
      //   const response = await openai.createCompletion({
      //     model: "text-davinci-002",
      //     prompt,
      //     temperature: 0.7,
      //     max_tokens: 256,
      //     top_p: 1,
      //     frequency_penalty: 0,
      //     presence_penalty: 0,
      //   });
      //   console.log(response);
      //   editor.update(() => {
      //     const root = $getRoot();
      //     const choices = response.data.choices;
      //     if (choices == null) {
      //       return;
      //     }
      //     const firstchoice = choices[0];
      //     if (firstchoice == null) {
      //       return;
      //     }
      //     const text = firstchoice.text;
      //     if (text == null) {
      //       return;
      //     }
      //     console.log(text);
      //     const textNode = $createTextNode(text);
      //     root.append(textNode);
      //   });
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

  return null;
}

export function Editor({
  editorStateRef,
  className,
  openai,
}: {
  editorStateRef: MutableRefObject<EditorState | null>;
  className?: string;
  openai: OpenAIApi;
}): JSX.Element {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: Error, _: LexicalEditor) => {
      console.error(error);
    },
    nodes: [],
  };

  return (
    <div
      className={`prose prose-sm prose-stone outline-none relative ${
        className ?? ""
      } mx-auto`}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[100px] text-sm outline-none w-full h-full pt-12" />
          }
          placeholder=""
        />
        <OnChangePlugin
          onChange={(editorState) => (editorStateRef.current = editorState)}
        />
        <HistoryPlugin />
        <OpenAIPlugin openai={openai} />
      </LexicalComposer>
    </div>
  );
}
