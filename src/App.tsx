/* App.jsx */
import React, { Ref, useEffect, useState } from 'react';
import { useRef } from 'react';
import { Block, Button, App, Page, Navbar, Link, Icon, BlockTitle, Actions, ActionsButton, ActionsGroup, ActionsLabel, Popover, Popup } from 'konsta/react';
import { GewinnTyp, OverviewCard, OverviewCardRef } from './OverviewCard';
import { Keypad, KeypadRef } from './Keypad';
import { initDB, useIndexedDB } from 'react-indexed-db-hook';
import { DBConfig } from './DBConfig';
import { BsCashCoin } from "react-icons/bs";
import { SlPaypal } from "react-icons/sl";
import { FaChild } from "react-icons/fa";
import { IoIosMan } from "react-icons/io";
import { FaCashRegister } from "react-icons/fa6";
import { ReactComponent as Logo} from './cash-register-solid.svg';
import { TiThMenu } from "react-icons/ti";
import QRCode from 'react-qr-code';
import { PaypalPopup } from './PaypalPopup';



initDB(DBConfig);

export default function MyApp() { 

    let names = ["Lukas", "Andi"];

    const refs = useRef<OverviewCardRef[]>([]);
    const [actionOpen, setActionOpen] = useState(false);
    const [qrPopup, setQrPopup] = useState(false);
    const keypadRef = useRef<KeypadRef>(null);
    const [zahlungStatePayPal, setPaypal] = useState(false);
    const keypadValue = useRef(0);
    const { clear } = useIndexedDB("buchungen");

    return ( 
        <App theme="ios" dark safeAreas>
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
          <Actions opened={actionOpen} onBackdropClick={() => setActionOpen(false)}>
            <ActionsGroup>
              <ActionsLabel>Aktionen</ActionsLabel>
              <ActionsButton onClick={() => {
                  setActionOpen(false);
                  clear().then(() => {
                    console.log("All Clear!");
                    refs.current.forEach(ref => ref.reset());
                    keypadRef.current.reset();
                  });
                }} bold>
                Daten löschen
              </ActionsButton>
              <ActionsButton onClick={() => setActionOpen(false)}>
                Abbrechen
              </ActionsButton>
            </ActionsGroup>
          </Actions>
          <PaypalPopup opened={qrPopup} close={() => setQrPopup(false)} amount={keypadValue.current} />
        </Page>
      </App>
    );
}