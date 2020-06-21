import { h, Component } from 'preact';
import { useState, useEffect } from "preact/hooks";
import style from './style';
// import { getCurrentUrl } from 'preact-router';
import axios from 'axios';

const BetterLetters = () => {
    const [letters, setLetters] = useState([]);
    const [letterCount, setLetterCount] = useState(0);
    let [seconds, setSeconds] = useState(30);
    const [playMode, setPlayMode] = useState('choosingLetters'); // choosingLetters, ready, finished
    let [secondsDegrees, setSecondsDegrees] = useState(90);
    const [computerChoicesOpen, setComputerChoicesOpen] = useState(false);
    const [enteredText, setEnteredText] = useState('');
    const [wordMisMatch, setWordMisMatch] = useState(false);
    const [definitions, setDefinitions] = useState([]);
    const [wordCheckEmployed, setWordCheckEmployed] = useState(false);
    const [timer, setTimer] = useState(0);
    // const [count, setCount] = useState(10);
    const [computerAnagrams, setComputerAnagrams] = useState([])

    function getVowel () {
      const vowelsArray = [
        ["A", 15],
        ["E", 21],
        ["I", 13],
        ["O", 13],
        ["U", 5],
      ];
  
      // Get the total weight
      let total = 1;
      for (let i = 0; i < vowelsArray.length; ++i) {
        total += vowelsArray[i][1];
      }
  
      console.log({ total });
  
      // Get random index
      const threshold = Math.floor(Math.random() * total);
  
      console.log({ threshold });
  
      // Find value that meets threshold
      total = 0;
      for (let i = 0; i < vowelsArray.length; ++i) {
        // Add the weight to our running total.
        total += vowelsArray[i][1];
  
        // If this value falls within the threshold, we're done!
        if (total >= threshold) {
          const randomVowel = vowelsArray[i][0];
          setLetters([...letters, randomVowel]);
          setLetterCount(letterCount + 1);
          break;
        }
      }
    }

    function getConsonant () {
      const consonantsArray = [
        ["B", 2],
        ["C", 3],
        ["D", 6],
        ["F", 2],
        ["G", 3],
        ["H", 2],
        ["J", 1],
        ["K", 1],
        ["L", 5],
        ["M", 4],
        ["N", 8],
        ["P", 4],
        ["Q", 1],
        ["R", 9],
        ["S", 9],
        ["T", 9],
        ["V", 1],
        ["W", 1],
        ["X", 1],
        ["Y", 1],
        ["Z", 1],
      ];
  
      // Get the total weight
      let total = 1;
      for (let i = 0; i < consonantsArray.length; ++i) {
        total += consonantsArray[i][1];
      }
  
      console.log({ total });
  
      // Get random index
      const threshold = Math.floor(Math.random() * total);
  
      // Find value that meets threshold
      total = 0;
      for (let i = 0; i < consonantsArray.length; ++i) {
        // Add the weight to our running total.
        total += consonantsArray[i][1];
  
        // If this value falls within the threshold, we're done!
        if (total >= threshold) {
          const randomConsonant = consonantsArray[i][0];
          setLetters([...letters, randomConsonant]);
          setLetterCount(letterCount + 1);
          break;
        }
      }
    }

    useEffect(() => {
      'Is this being called every time?'
      if (letterCount === 9) {
        console.log({letterCount});
        setPlayMode('ready');
        setSeconds(30);
      }
    }, [letters, letterCount])

    function startPlayback() {
      const audioPromise = new Audio("../../assets/audio/countdown.mp3").play();
      return audioPromise;
    }

    function startTimer() {
      // fetch best responses from CountDown API
      getComputerAnagrams(letters);
  
      console.log(seconds);
      if (seconds && seconds > 0) {
        console.log("Attempting to play automatically...");
  
        startPlayback()
          .then(() => {
            console.log("The play() Promise fulfilled! Rock on!");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    useEffect(setTimer(setInterval(() => {
        setSeconds(seconds -= 1);
        setSecondsDegrees(secondsDegrees += (360/60));
        if (seconds === 0) {
          console.log('is this check happening??')
          clearInterval(timer);
          setPlayMode('finished');
        }
      }, 1000)), [seconds, secondsDegrees]);

    // function countDown() {
    //   // Remove one second, set state so a re-render happens.
    //   console.log("counting down the seconds ...");
  
    //   // let countSeconds = seconds - 1;
    //   // let secondsDegrees = secondsDegrees + 360 / 60;
    //   setSeconds(seconds -= 1);
    //   setSecondsDegrees(secondsDegrees += (360/60));

  
    //   // Check if we're at zero.
    //   if (seconds === 0) {
    //     console.log('is this check happening??')
    //     clearInterval(timer);
    //     setPlayMode('finished');
    //   }
    // }

    function getComputerAnagrams(letterArray) {
      console.log(letterArray);
      const letterString = letterArray.join("");
      console.log({ letterString });
  
      axios
        .get(
          `https://danielthepope-countdown-v1.p.rapidapi.com/solve/${letterString}?variance=1`,
          {
            headers: {
              "x-rapidapi-host": "danielthepope-countdown-v1.p.rapidapi.com",
              "x-rapidapi-key":
                "5e458fcdc9msheb1cb44d935da2fp1cbb49jsnd1ef623fd51c",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setComputerAnagrams(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function checkWord(e) {
      e.preventDefault();
      const wordToCheck = event.target['inputWord'].value
      
      // if(wordToCheck.split('').every(letter => this.state.letters.includes(letter))) {
        let config = {
          headers: {
            "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
            "x-rapidapi-key": "5e458fcdc9msheb1cb44d935da2fp1cbb49jsnd1ef623fd51c"
          }
        }
    
        axios.get(`https://wordsapiv1.p.rapidapi.com/words/${wordToCheck}/definitions/`
        , config)
        .then((response) => {
          console.log(response.data);
          
            setDefinitions(response.data['definitions']);
            setWordMisMatch(true);
        })
        .catch((error)=> {
          console.log(error);
        });
  
      // } else {
      //   this.setState({wordMisMatch: true,})
      // }
  
      
    }
  
    function showComputerChoices() {
      setComputerChoicesOpen(true);
    }
  
    function clearInput() {
      if(wordMisMatch) {
        setEnteredText('');
        setWordMisMatch(false);
      }
    }
  
    function playAgain() {
        setPlayMode('choosingLetters');
        setLetterCount(0);
        setLetters([]);
        setComputerChoicesOpen(false);
        setSecondsDegrees(90);
        setEnteredText('');
        setWordMisMatch(false);
        setDefinitions([]);
    }
  
  
    console.log(playMode);
    console.log(secondsDegrees);
    return (
      
      <div class={style.profile}>
        <div class={style.innerContainer}>
        <div class={style.instructionContainer}>
          <p
            class={
              playMode === "choosingLetters"
                ? style.instructionText
                : style.instructionTextOff
            }
          >
            Choose a letter
          </p>
        </div>

        <div class={style.buttonContainer}>
          <button
            class={
              playMode !== "finished" ? style.button : style.buttonOff
            }
            onClick={getVowel}
          >
            Vowel
          </button>
          <button
            class={
              playMode !== "finished" ? style.button : style.buttonOff
            }
            onClick={getConsonant}
          >
            Consonant
          </button>
        </div>

        <div class={style.letterContainer}>
          <div class={style.letterDiv}>
            {letters[0] ? letters[0] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[1] ? letters[1] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[2] ? letters[2] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[3] ? letters[3] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[4] ? letters[4] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[5] ? letters[5] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[6] ? letters[6] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[7] ? letters[7] : "?"}
          </div>
          <div class={style.letterDiv}>
            {letters[8] ? letters[8] : "?"}
          </div>
        </div>

        <div class={style.startGame}>
          <button
            class={
              playMode === "ready" ? style.button : style.buttonOff
            }
            onClick={startTimer}
          >
            Start Countdown
          </button>
        </div>

        <div class={style.playAgainContainer}>
          <button
            class={
              playMode === "finished" ? style.button : style.buttonOff
            }
            onClick={playAgain}
          >
            Play again
          </button>
        </div>

        <div class={playMode !== "finished" ? style.clock : style.clockOff}>
          <div class={style.clockFace}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "0%",
                transformOrigin: "100%",
                transform: `rotate(${secondsDegrees}deg)`,
                background: "aqua",
                height: "4px",
                width: "50%",
              }}
            />
          </div>
        </div>

        <form class={playMode === "finished" ? style.form: style.formOff} name="wordToCheck" onSubmit={checkWord}>
          <div class={style.column}>
            <input class={style.answer} id="wordToCheck" name="inputWord" type="text" value={enteredText} />

            <input type="Submit" class={style.button} value="Check word in dictionary" />
          </div>
            <div class={style.wordContainer}>
            {wordCheckEmployed && definitions.length === 0
              ? "❌ Word not found in dictionary"
              : <div>
              <span>{definitions.length > 0 ? "✅ Word found! Definition(s):" : ""}</span>
              <ul> {definitions.map((result) => (
                
                    <li>{result.definition}</li>
                  
                ))}
                </ul></div>}
                
            </div>
        </form>

  
        {/* <div class={playMode === "finished" ? style.listContainer: style.listContainerOff}>
          <div class={playMode === "finished" ? style.computerChoices: style.computerChoicesOff}>
            {!computerAnagrams
              ? ""
              : `The computer found ${computerAnagrams.length} word(s). Longest word has ${computerAnagrams[0]['length']} characters.  `}
              <a href="#" class={playMode === "finished" ? style.link : style.linkOff} onClick={showComputerChoices}>  Click here</a> to view word(s):
              
              <ul class={computerChoicesOpen ? style.computerChoicesShown : style.computerChoicesHidden}>
                {!computerAnagrams
                  ? ""
                  : computerAnagrams.map((result) => (
                  <li>{result.word} - length {result.length}</li>
                    ))}
              </ul>
            </div>
        </div> */}
        
      </div>
    </div>

  );


}


  export default BetterLetters