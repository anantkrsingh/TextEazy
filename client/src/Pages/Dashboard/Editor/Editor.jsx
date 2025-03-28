import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $getSelection } from "lexical";
import {
  Bold,
  Italic,
  Underline,
  Undo2,
  Redo2,
  Save,
  Cloud,
} from "lucide-react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import apiHelper from "../../../utils/api";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ToolbarPlugin = ({ isSaving, saveToDraft }) => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        selection.formatText(format);
      }
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 1, p: 1, borderBottom: "1px solid #ccc" }}>
      <IconButton onClick={() => formatText("bold")}>
        <Bold />
      </IconButton>
      <IconButton onClick={() => formatText("italic")}>
        <Italic />
      </IconButton>
      <IconButton onClick={() => formatText("underline")}>
        <Underline />
      </IconButton>
      <IconButton onClick={() => editor.dispatchCommand("UNDO_COMMAND")}>
        <Undo2 />
      </IconButton>
      <IconButton onClick={() => editor.dispatchCommand("REDO_COMMAND")}>
        <Redo2 />
      </IconButton>
    </Box>
  );
};

const WordCountPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
      });
    });

    return () => unregister();
  }, [editor]);

  return (
    <Typography
      sx={{ textAlign: "right", mt: 1, mr: 1 }}
      variant="body2"
      color="text.secondary"
    >
      Word Count: {wordCount}
    </Typography>
  );
};

const Editor = () => {
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [editor, setEditor] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const initialConfig = {
    namespace: "MyEditor",
    theme: {
      text: {
        color: "black",
      },
    },
    editorState: content,
    onError: (error) => {
      console.error("Lexical Error:", error);
    },
  };

  const handleDriveSave = async () => {
    setIsSaving(true);
    try {
      const response = await apiHelper.post(`/docs/saveToDrive/${docId}`);
      console.log(response);
      setNotification({ open: true, message: "Document saved to Drive successfully!", severity: "success" });
    } catch (error) {
      console.error(error);
      setNotification({ open: true, message: "Failed to save document to Drive.", severity: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await apiHelper.get(`/docs/${docId}`);
        const fetchedContent = response.content;
        setContent(fetchedContent);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (docId) {
      fetchContent();
    }
  }, [docId]);

  const saveToDraft = async () => {
    setIsSaving(true);
    try {
      await apiHelper.put(`/docs/update/${docId}`, { content });
      console.log("Document saved successfully!");
    } catch (error) {
      console.error("Failed to save the document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
          position: "relative",
        }}
      >
        <ToolbarPlugin isSaving={isSaving} saveToDraft={saveToDraft} />

        <Box sx={{ p: 2, minHeight: "300px" }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                style={{
                  outline: "none",
                  minHeight: "300px",
                  color: "black",
                }}
              />
            }
            placeholder={
              <Typography color="text.secondary">Start typing...</Typography>
            }
          />

          <OnChangePlugin
            onChange={(editorState) => {
              if (!editor) {
                const [currentEditor] = editorState._nodeMap.values();
                setEditor(currentEditor);
              }
              setContent(JSON.stringify(editorState.toJSON()));
            }}
          />

          <HistoryPlugin />
          <WordCountPlugin />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={saveToDraft}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={18} /> : <Save />}
          >
            {isSaving ? "Saving..." : "Save to Draft"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDriveSave}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={18} /> : <Cloud />}
          >
            {isSaving ? "Saving..." : "Save to Drive"}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </LexicalComposer>
  );
};

export default Editor;
