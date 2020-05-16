import { h, Component } from 'preact';
import { useState, useEffect } from "preact/hooks";
import style from './style';
import { getCurrentUrl } from 'preact-router';

const Betters = () => {
    const [hello, setHello] = useState("hi there!");

    useEffect(() => {
        setHello('Good morning')
      }, [hello])

    return (<div><h1>{hello}</h1>
      <button type='button' onChange={() => setHello('goodBye')} >click to say goodbye</button>
      </div>
      );




};

  export default Betters