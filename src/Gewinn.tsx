import { BlockTitle, Block, Button, Icon } from "konsta/react";
import { BsCashCoin } from "react-icons/bs";
import { FaChild } from "react-icons/fa";
import { SlPaypal } from "react-icons/sl";
import { Keypad, KeypadRef } from "./Keypad";
import { GewinnTyp, OverviewCardRef } from "./OverviewCard";
import { PaypalPopup } from "./PaypalPopup";
import { useState, useRef, MutableRefObject } from "react";

type GewinnProps = {
    keypadRef: MutableRefObject<KeypadRef>;
    refs: MutableRefObject<OverviewCardRef[]>;
    names: string[]
}

export function Gewinn(props: GewinnProps) {

    const [zahlungStatePayPal, setPaypal] = useState(false);
    const keypadValue = useRef(0);
    const [qrPopup, setQrPopup] = useState(false);


    return <>
    <BlockTitle>Buchung</BlockTitle>
    <Block strong outlineIos className="space-y-2">
      <Keypad onChange={val => keypadValue.current = val} ref={props.keypadRef} />
      <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
        <Button onClick={() => {
          setPaypal(true);
        }} outline={!zahlungStatePayPal} large><Icon className='detailIcon' style={{position: "relative", top: "-0.07em"}}><SlPaypal /></Icon> PayPal</Button>
        <Button onClick={() => {
            setPaypal(false);
        }} outline={zahlungStatePayPal} large><Icon className='detailIcon'><BsCashCoin /></Icon> Bar</Button>
        {props.names.map((name: string, index: number) => {return <Button key={name} className='k-color-brand-red' onClick={() => {
          props.refs.current[index].increase(keypadValue.current, zahlungStatePayPal ? GewinnTyp.PAYPAL : GewinnTyp.BAR);
          props.keypadRef.current.reset();
          if (zahlungStatePayPal) {
            setQrPopup(true);
          }
        }} large><Icon className='detailIcon' style={{position: "relative", top: "-0.07em"}}><FaChild /></Icon>{name}</Button>})}
      </div>
    </Block>
    <PaypalPopup opened={qrPopup} close={() => setQrPopup(false)} amount={keypadValue.current} />
    </>
}