import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import OpenAI from "openai-api";

const openai = new OpenAI(
  "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"
);

const HintButton = ({ problemDescription }) => {
  const [hint, setHint] = useState("");
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    // Generate a hint using OpenAI
    const prompt = `Generate a hint for a coding problem with the following description: ${problemDescription}`;
    const response = await openai.complete({
      engine: "ada",
      prompt,
      maxTokens: 150,
      temperature: 0.5,
    });
    setHint(response.data.choices[0].text);
    setOpen(true);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClick}>
        Get a Hint
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Hint</DialogTitle>
        <DialogContent>{hint}</DialogContent>
      </Dialog>
    </>
  );
};

export default HintButton;
