import { useEffect } from "react";
import { useState } from "react";
const useSelectedText = () => {
  // This custom hook is  tracking the state of the current text selection
  const [selectedText, setSelectedText] = useState("");
  const handleSelectText = () => {
    setSelectedText(window.getSelection().toString());
  };
;
  useEffect(() => {
    window.addEventListener("mouseup", handleSelectText);

    return () => {
      // Destroying the event listener before component unmounts
      window.removeEventListener("mouseup", handleSelectText);
    };
  }, []);
  return { selectedText };
};
export default useSelectedText;
