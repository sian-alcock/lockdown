import { h, Component } from "preact";
// import { useState } from "preact/hooks";
import style from "./style";



export default class Numbers extends Component {
  state = {
    targetNumber: 0,
    seconds: 30,
    definitions: [],
    largeNumberCount: 0,
    numberCount: 0,
    numbers: [],
    playMode: "choosingNumbers", // choosingNumbers, getTargetNumber, ready, finished
    secondsDegrees: 90,
    noMoreLargeNumbers: false,
  };
   

  getLargeNumber = () => {
    const largeNumbersArray = [
      [25, 1],
      [50, 1],
      [75, 1],
      [100, 1],
    ];

    // Get the total weight
    let total = 1;
    for (let i = 0; i < largeNumbersArray.length; ++i) {
      total += largeNumbersArray[i][1];
    }

    console.log({ total });

    // Get random index
    const threshold = Math.floor(Math.random() * total);

    console.log({ threshold });

    // Find value that meets threshold
    total = 0;
    for (let i = 0; i < largeNumbersArray.length; ++i) {
      // Add the weight to our running total.
      total += largeNumbersArray[i][1];

      // If this value falls within the threshold, we're done!
      if (total >= threshold) {
        const randomLargeNumber = largeNumbersArray[i][0];
        this.setState(
          {
            numbers: [...this.state.numbers, randomLargeNumber],
            numberCount: this.state.numberCount + 1,
            largeNumberCount: this.state.largeNumberCount + 1,
          },
          () => this.checkNumbers()
        );
        break;
      }
    }
  };

  getSmallNumber = () => {
    const smallNumbersArray = [
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [7, 2],
      [8, 2],
      [9, 2],
      [10, 2],
    ];

    // Get the total weight
    let total = 1;
    for (let i = 0; i < smallNumbersArray.length; ++i) {
      total += smallNumbersArray[i][1];
    }

    console.log({ total });

    // Get random index
    const threshold = Math.floor(Math.random() * total);

    // Find value that meets threshold
    total = 0;
    for (let i = 0; i < smallNumbersArray.length; ++i) {
      // Add the weight to our running total.
      total += smallNumbersArray[i][1];

      // If this value falls within the threshold, we're done!
      if (total >= threshold) {
        const randomSmallNumber = smallNumbersArray[i][0];
        this.setState(
          {
            numbers: [...this.state.numbers, randomSmallNumber],
            numberCount: this.state.numberCount + 1,
          },
          () => this.checkNumbers()
        );
        break;
      }
    }
  };

  checkNumbers() {
    //When total reaches six - hide the buttons
    if (this.state.numberCount === 6) {
      console.log(this.state.numberCount);
      this.setState({
          playMode: "getTargetNumber"
        });
    }

    if(this.state.largeNumberCount === 4) {
      this.setState({
        noMoreLargeNumbers: true,
      })
    }
  }

  startPlayback() {
    const audioPromise = new Audio("../../assets/audio/countdown.mp3").play();
    return audioPromise;
  }

  startTimer() {


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
        playMode: "finished"
      });
    }
  }

  getTargetNumber() {
    const targetNumber = Math.floor((Math.random() * 899) + 100);
    console.log(targetNumber);
    if(targetNumber) {
    this.setState({ 
        playMode: "ready",
        seconds: 30,
        targetNumber
      });
    }
}

  playAgain() {
    this.setState({
      playMode: 'choosingNumbers',
      largeNumberCount: 0,
      numberCount: 0,
      numbers: [],
      targetNumber: 0,
      secondsDegrees: 90,
      noMoreLargeNumbers: false,
    })
  }


  render() {
    console.log(this.state.playMode);

    return (
      <div class={style.profile}>
        <div class={style.innerContainer}>
        <div class={style.instructionContainer}>
          <p
            class={
              this.state.playMode === "choosingNumbers"
                ? style.instructionText
                : style.instructionTextOff
            }
          >
            Choose 6 numbers, including no more than 4 large numbers
          </p>
        </div>

        <div class={style.buttonContainer}>
          <button
            class={
              (this.state.playMode === "choosingNumbers" && !this.state.noMoreLargeNumbers) ? style.button : style.buttonOff
            }
            onClick={this.getLargeNumber}
          >
            Large number
          </button>
          <button
            class={
              this.state.playMode === "choosingNumbers" ? style.button : style.buttonOff
            }
            onClick={this.getSmallNumber}
          >
            Small number
          </button>

          <button
            class={
              this.state.playMode === "getTargetNumber" ? style.button : style.buttonOff
            }
            onClick={this.getTargetNumber.bind(this)}
          >
            Generate Target Number
          </button>
        </div>

        <div class={style.targetNumberContainer}>
          <div class={style.numberDiv}>
            {this.state.targetNumber > 0 ? this.state.targetNumber : "?" }
          </div>
        </div>

        <div class={style.numberContainer}>
          <div class={style.numberDiv}>
            {this.state.numbers[0] ? this.state.numbers[0] : "?"}
          </div>
          <div class={style.numberDiv}>
            {this.state.numbers[1] ? this.state.numbers[1] : "?"}
          </div>
          <div class={style.numberDiv}>
            {this.state.numbers[2] ? this.state.numbers[2] : "?"}
          </div>
          <div class={style.numberDiv}>
            {this.state.numbers[3] ? this.state.numbers[3] : "?"}
          </div>
          <div class={style.numberDiv}>
            {this.state.numbers[4] ? this.state.numbers[4] : "?"}
          </div>
          <div class={style.numberDiv}>
            {this.state.numbers[5] ? this.state.numbers[5] : "?"}
          </div>

        </div>

        <div class={style.startGame}>
          <button
            class={
              this.state.playMode === "ready" ? style.button : style.buttonOff
            }
            onClick={this.startTimer.bind(this)}
          >
            Start countdown
          </button>
        </div>

        <div class={style.playAgainContainer}>
          <button
            class={
              this.state.playMode === "finished" ? style.button : style.buttonOff
            }
            onClick={this.playAgain.bind(this)}
          >
            Play again
          </button>
        </div>

        <div class={this.state.playMode !== "finished" ? style.clock : style.clockOff}>
          <div class={style.clockFace}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "0%",
                transformOrigin: "100%",
                transform: `rotate(${this.state.secondsDegrees}deg)`,
                background: "aqua",
                height: "4px",
                width: "50%",
              }}
            />
          </div>
        </div>
        </div>
      </div>
    );
  }
}
