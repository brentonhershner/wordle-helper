import React, { useEffect, useState } from "react";
import "./App.css";
import { words } from "./words.js";
import unique from "just-unique";

const WordleHelper = () => {
  const WORD_DISPLAY_LIMIT = 500;

  const [possible, setPossible] = useState(words);
  const [excluded, setExcluded] = useState("");
  const [misplaced, setMisplaced] = useState("");
  const [located, setLocated] = useState(Array(5).fill(""));

  const changeLetter = (e, position) => {
    const form = e.target.form;
    const key = e.keyCode;
    let newLetter = "";
    if (key >= 65 && key <= 90) {
      // a-z keys
      newLetter = e.key;
      if (position < form.elements.length - 1) {
        form.elements[position + 1].focus();
      }
    } else if (key === 9) {
      // tab
      return;
    } else if (key === 46) {
      // forward delete
      newLetter = "";
    } else if (key === 8) {
      // backspace
      newLetter = "";
      if (position > 0) {
        form.elements[position - 1].focus();
      }
    } else {
      return;
    }
    const newLocated = located.slice();
    newLocated.splice(position, 1, newLetter.toUpperCase());
    setLocated(newLocated);
    e.preventDefault();
  };

  const updateExcluded = (e) => {
    setExcluded(unique(e.target.value.toUpperCase().split("")).join(""));
  };

  const updateMisplaced = (e) => {
    setMisplaced(e.target.value.toUpperCase());
  };

  const filterLocated = (word) => {
    return located.every((letter, index) => {
      return letter === "" || letter === word[index];
    });
  };

  const filterExcluded = (word) => {
    return !excluded
      .split("")
      .some((excludedLetter) => word.includes(excludedLetter));
  };

  const filterMisplaced = (candidateWord) => {
    return (
      true !==
      misplaced.split("").reduce((word, letter) => {
        if (word === true) {
          return true;
        }
        const index = word.indexOf(letter);
        if (index === -1) {
          return true;
        }
        return word.slice(0, index).concat(word.slice(index + 1));
      }, candidateWord.split(""))
    );
  };

  useEffect(() => {
    if (!excluded) {
      setPossible(words);
    }
    const updatedList = words
      .filter(filterExcluded)
      .filter(filterMisplaced)
      .filter(filterLocated);

    setPossible(updatedList);
  }, [excluded, located, misplaced]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordle Helper</h1>

        <h2 className="label">Correct Letters</h2>
        <form className="inputs">
          {located.map((value, position) => {
            return (
              <input
                key={position}
                position={position}
                value={value}
                className="letter"
                type={"text"}
                onKeyDown={(e) => changeLetter(e, position)}
              />
            );
          })}

          <h2 className="label">Misplaced but Correct</h2>
          <input
            className="misplaced"
            name="misplaced"
            type={"text"}
            value={misplaced}
            onChange={updateMisplaced}
          />

          <h2 className="label">Rejects</h2>
          <input
            className="rejects"
            name="rejects"
            type={"text"}
            value={excluded}
            onChange={updateExcluded}
          />
        </form>
      </header>
      <div className="results">
        <h2 className="label">{possible.length} possible words</h2>
        {excluded || misplaced || !located.every((l) => !l) ? (
          <>
            <ul className="list">
              {possible.slice(0, WORD_DISPLAY_LIMIT).map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
            <>
              {possible.length > WORD_DISPLAY_LIMIT && (
                <p key="last">
                  Only displaying the first {WORD_DISPLAY_LIMIT} words. Filter
                  some more.
                </p>
              )}
            </>
          </>
        ) : (
          <p>Try to filter down the list of words using the fields above.</p>
        )}
      </div>
    </div>
  );
};

export default WordleHelper;
