import { h, Component } from "preact";
import axios from "axios";
import style from "./style";



export default class Letters extends Component {
  state = {
    seconds: 30,
    timer: 0,
    count: 10,
    letterCount: 0,
    letters: [],
    playMode: "choosingLetters", // choosingLetters, ready, finished
    timerMessage: "",
    secondsDegrees: 90,
    computerChoicesOpen: false
  };

  getVowel = () => {
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
        this.setState(
          {
            letters: [...this.state.letters, randomVowel],
            letterCount: this.state.letterCount + 1,
          },
          () => this.checkLetters()
        );
        break;
      }
    }
  };

  getConsonant = () => {
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
        this.setState(
          {
            letters: [...this.state.letters, randomConsonant],
            letterCount: this.state.letterCount + 1,
          },
          () => this.checkLetters()
        );
        break;
      }
    }
  };

  checkLetters() {
    if (this.state.letterCount === 9) {
      console.log(this.state.letterCount);
      this.setState({ playMode: "ready", seconds: 30 });
    }
  }

  startPlayback() {
    const audioPromise = new Audio("../../assets/audio/countdown.mp3").play();
    return audioPromise;
  }

  startTimer() {
    // fetch best responses from CountDown API
    this.getComputerAnagrams(this.state.letters);

    console.log(this.state.seconds);
    if (this.state.seconds && this.state.seconds > 0) {
      console.log("Attempting to play automatically...");

      this.startPlayback()
        .then(() => {
          console.log("The play() Promise fulfilled! Rock on!");
        })
        .catch((error) => {
          console.log("The play() Promise rejected!");
          console.log("Use the Play button instead.");
          console.log(error);
        });
      this.timer = setInterval(this.countDown.bind(this), 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    console.log("counting down the seconds ...");

    let countSeconds = this.state.seconds - 1;
    let secondsDegrees = this.state.secondsDegrees + 360 / 60;
    this.setState({
      seconds: countSeconds,
      secondsDegrees,
    });

    // Check if we're at zero.
    if (countSeconds === 0) {
      clearInterval(this.timer);
      this.setState({
        playMode: "finished",
        timerMessage: "Time is up!!!",
      });
    }
  }

  getComputerAnagrams(letterArray) {
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
        this.setState({ computerAnagrams: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkWord(e) {
    e.preventDefault();
    console.log('is this even working??')
    console.log(event.target['inputWord'].value)
  
    const wordToCheck = event.target['inputWord'].value
    
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
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  showComputerChoices() {
    this.setState({computerChoicesOpen: true})
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    console.log(this.state.playMode);

    return (
      <div class={style.profile}>
        <div class={style.instructionContainer}>
          <p
            class={
              this.state.playMode === "choosingLetters"
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
              this.state.letters.length < 9 ? style.button : style.buttonOff
            }
            onClick={this.getVowel}
          >
            Vowel
          </button>
          <button
            class={
              this.state.letters.length < 9 ? style.button : style.buttonOff
            }
            onClick={this.getConsonant}
          >
            Consonant
          </button>
        </div>

        <div class={style.letterContainer}>
          <div class={style.letterDiv}>
            {this.state.letters[0] ? this.state.letters[0] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[1] ? this.state.letters[1] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[2] ? this.state.letters[2] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[3] ? this.state.letters[3] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[4] ? this.state.letters[4] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[5] ? this.state.letters[5] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[6] ? this.state.letters[6] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[7] ? this.state.letters[7] : "?"}
          </div>
          <div class={style.letterDiv}>
            {this.state.letters[8] ? this.state.letters[8] : "?"}
          </div>
        </div>

        <div class={style.startGame}>
          <button
            class={
              this.state.playMode === "ready" ? style.button : style.buttonOff
            }
            onClick={this.startTimer.bind(this)}
          >
            Start Countdown
          </button>
        </div>

        <div class={style.clock}>
          <div class={style.clockFace}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "0%",
                transformOrigin: "100%",
                transform: `rotate(${this.state.secondsDegrees}deg)`,
                background: "black",
                height: "4px",
                width: "50%",
              }}
            />
          </div>
        </div>

        <form class={this.state.playMode === "finished" ? style.form: style.formOff} name="wordToCheck" onSubmit={this.checkWord.bind(this)}>
          <input class={style.answer} id="wordToCheck" name="inputWord" type="text" placeholder="Check word features in dictionary" />

          <input type="Submit" class={style.button} value="Submit word" />
        </form>

        <div class={this.state.playMode === "finished" ? style.computerChoices: style.computerChoicesOff}>
          {!this.state.computerAnagrams
            ? ""
            : `The computer found ${this.state.computerAnagrams.length} word(s).`}
            <button onClick={this.showComputerChoices.bind(this)}>Click here to view word(s)</button>
          <ul class={this.state.computerChoicesOpen ? style.computerChoicesShown : style.computerChoicesHidden}>
            {!this.state.computerAnagrams
              ? ""
              : this.state.computerAnagrams.map((result) => (
                  <li>{result.word}</li>
                ))}
          </ul>
        </div>
      </div>
    );
  }
}
