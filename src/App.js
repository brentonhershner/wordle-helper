import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import words from "an-array-of-english-words";

const words5letters = words.filter((word) => word.length === 5);

const App = () => {
  const WORD_DISPLAY_LIMIT = 500;

  const [possible, setPossible] = useState(words5letters);
  const [excluded, setExcluded] = useState("");
  const [located, setLocated] = useState([...Array(5).fill("")]);

  const changeLetter = (e, position) => {
    const key = e.keyCode;
    // console.log(e.key);
    // console.log(e.keyCode);
    let newLetter = "";
    if (key >= 65 && key <= 90) {
      newLetter = e.key;
    } else if (key === 8 || key === 46) {
      newLetter = "";
    } else if (key === 9) {
      // change focus
      return;
    } else {
      return;
    }
    const newLocated = located.slice();
    newLocated.splice(position, 1, newLetter);
    setLocated(newLocated);
    const form = e.target.form;
    if (position < form.elements.length - 1) {
      form.elements[position + 1].focus();
    }
    e.preventDefault();
  };

  const updateExcluded = (e) => {
    console.log(`update Excluded: ${e.target.value}`);
    setExcluded(e.target.value);
  };

  const filterExcluded = (word) => {
    return !excluded
      .split("")
      .some((excludedLetter) => word.includes(excludedLetter));
  };

  const filterLocated = (word) => {
    // return true to reject
    // if any letter does not match, return true
    return located.every((letter, index) => {
      // letter is empty or letter matches letter in word
      return letter === "" || letter === word[index];
    });
  };

  useEffect(() => {
    if (!excluded) {
      console.log("make all available");
      console.log(words5letters.length);
      setPossible(words5letters);
    }
    const updatedList = words5letters
      .filter(filterExcluded)
      .filter(filterLocated);
    // (words5letters, excluded);
    // const updatedList2 = filterLocated(updatedList, located);

    setPossible(updatedList);
  }, [excluded, located]);

  useEffect(() => {
    console.log(`Possibilities: ${possible.length}`);
  }, [possible]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordle Helper</h1>
        <h2 className="label">{possible.length} possible words</h2>

        <h2 className="label">Not Used Letters</h2>
        <input
          name="notUsed"
          type={"text"}
          value={excluded}
          onChange={updateExcluded}
        />

        <h2 className="label">Located Letters</h2>
        <form className="">
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
        </form>
        <ul>
          {possible.slice(0, WORD_DISPLAY_LIMIT).map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
        {possible.length > WORD_DISPLAY_LIMIT && (
          <p key="last">
            Only displaying the first {WORD_DISPLAY_LIMIT} words. Filter some
            more.
          </p>
        )}
      </header>
    </div>
  );
};

export default App;
