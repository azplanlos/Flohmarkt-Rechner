/* App.jsx */
import React, { MutableRefObject, useState } from 'react';
import { useRef } from 'react';
import { Block, Button, App, Page, Navbar, Link, Icon, BlockTitle } from 'konsta/react';
import { GewinnTyp, OverviewCard, OverviewCardRef } from './OverviewCard';
import { Keypad, KeypadRef } from './Keypad';
import { initDB } from 'react-indexed-db-hook';
import { DBConfig } from './DBConfig';
import { BsCashCoin } from "react-icons/bs";
import { SlPaypal } from "react-icons/sl";
import { FaChild } from "react-icons/fa";
import { FaCashRegister } from "react-icons/fa6";
import { ReactComponent as Logo} from './cash-register-solid.svg';
import { TiThMenu } from "react-icons/ti";
import { PaypalPopup } from './PaypalPopup';
import { ActionMenu } from './ActionMenu';



initDB(DBConfig);

let refs: MutableRefObject<OverviewCardRef[]>;
let keypadRef: MutableRefObject<KeypadRef>;

function resetApp() {
  refs.current.forEach(ref => ref.reset());
  keypadRef.current.reset();
}

export default function MyApp() { 

    let names = ["Lukas", "Andi"];

    refs = useRef<OverviewCardRef[]>([]);
    const [actionOpen, setActionOpen] = useState(false);
    const [qrPopup, setQrPopup] = useState(false);
    const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    keypadRef = useRef<KeypadRef>(null);
    const [zahlungStatePayPal, setPaypal] = useState(false);
    const keypadValue = useRef(0);

    return ( 
        <App theme="ios" dark safeAreas className={dark ? 'dark' : ''}>
          <Page>
            <Navbar title="Kasse" left={
            <Link navbar iconOnly>
              <Icon><Logo title='Logo' /><FaCashRegister style={{visibility: "hidden", height: 1}}></FaCashRegister></Icon>
            </Link>
          } right={
            <Button onClick={() => setActionOpen(true)}><Icon><TiThMenu /></Icon></Button>
          }
          />
          {names.map((name: string, index: number) => {return <OverviewCard name={name} gewinn={0} ref={el => refs.current[index] = el} key={name} />})}

          <BlockTitle>Buchung</BlockTitle>
          <Block strong outlineIos className="space-y-2">
            <Keypad onChange={val => keypadValue.current = val} ref={keypadRef} />
            <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
              <Button onClick={() => {
                setPaypal(true);
              }} outline={!zahlungStatePayPal} large><Icon className='detailIcon' style={{position: "relative", top: "-0.07em"}}><SlPaypal /></Icon> PayPal</Button>
              <Button onClick={() => {
                  setPaypal(false);
              }} outline={zahlungStatePayPal} large><Icon className='detailIcon'><BsCashCoin /></Icon> Bar</Button>
              {names.map((name: string, index: number) => {return <Button key={name} className='k-color-brand-red' onClick={() => {
                refs.current[index].increase(keypadValue.current, zahlungStatePayPal ? GewinnTyp.PAYPAL : GewinnTyp.BAR);
                keypadRef.current.reset();
                if (zahlungStatePayPal) {
                  setQrPopup(true);
                }
              }} large><Icon className='detailIcon' style={{position: "relative", top: "-0.07em"}}><FaChild /></Icon>{name}</Button>})}
            </div>
          </Block>
          <ActionMenu opened={actionOpen} close={() => setActionOpen(false)} resetApp={resetApp} dark={dark} setDark={setDark} />
          <PaypalPopup opened={qrPopup} close={() => setQrPopup(false)} amount={keypadValue.current} />
        </Page>
      </App>
    );
}