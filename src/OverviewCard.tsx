import React, { Ref, useEffect, useImperativeHandle, useRef } from 'react';
import { useState, forwardRef } from 'react';
import { Card, Icon } from 'konsta/react';
import './OverviewCard.css'
import { useIndexedDB } from 'react-indexed-db-hook';
import { BsCashCoin } from "react-icons/bs";
import { SlPaypal } from "react-icons/sl";
import { ReactComponent as Logo} from './cash-register-solid.svg';


type OverviewCardProps = {
    name: string;
    gewinn: number;
}

export enum GewinnTyp {
  BAR,
  PAYPAL
}

export type OverviewCardRef = {
    increase: (gewinn: number, typ: GewinnTyp) => void;
    reset: () => void;
    convert: (betrag: number, neuerTyp: GewinnTyp) => void;
}

function erhoeheGewinn(gewinn: number, setFunction: (value: number) => void, getFunction: () => number) {
    setFunction(gewinn + getFunction());
}

export type DbGewinn = {
  name: string;
  gewinnBar: number;
  gewinnPayPal: number;
  id?: number
}

export type DbBuchung = {
  name: string;
  gewinnTyp: GewinnTyp;
  gewinn: number;
  zeit: number;
}

export const OverviewCard = forwardRef<OverviewCardRef, OverviewCardProps>((props: OverviewCardProps, ref: Ref<OverviewCardRef>) => {

  const { getAll, update, add } = useIndexedDB("gewinn");
  const addBuchung = useIndexedDB("buchungen").add;

  const [gw, sgw] = useState(props.gewinn);
  const [gwBar, setGwBar] = useState(0);
  const [gwPayPal, setGwPayPal] = useState(0);

  const stateRef = useRef<number>();
  const stateBarRef = useRef<number>();
  const statePayPalRef = useRef<number>();
  const idRef = useRef<number>();
  stateRef.current = gw;
  stateBarRef.current = gwBar;
  statePayPalRef.current = gwPayPal;

  useEffect(() => {
    const getData = async () => {
      await getAll().then(async (buchungen) => {
        const buchung = buchungen.filter((buchung) => buchung.name === props.name)[0];
        if (idRef.current === undefined) {
          if (buchung !== undefined) {
            console.log("found name " + buchung.name + " with id " + buchung.id);
            sgw(buchung.gewinnBar + buchung.gewinnPayPal);
            setGwBar(buchung.gewinnBar);
            setGwPayPal(buchung.gewinnPayPal);
            idRef.current = buchung.id;
          } else {
            await add({name: props.name, gewinnBar: 0, gewinnPayPal: 0}).then(result => {
              console.log("added " + props.name + " with id " + result);
              idRef.current = result
            }, error => console.log(error));
          }
        }
      });
    };
    getData();
  }, [getAll, add, props.name]);

  useImperativeHandle<OverviewCardRef, OverviewCardRef>(ref, () => {
    return {
      increase: (gewinn: number, typ: GewinnTyp) => {
        erhoeheGewinn(gewinn, sgw, () => stateRef.current);
        if (typ === GewinnTyp.BAR) {
          erhoeheGewinn(gewinn, setGwBar, () => stateBarRef.current);
        } else {
          erhoeheGewinn(gewinn, setGwPayPal, () => statePayPalRef.current);
        }
        erhoeheGewinn(gewinn, (val: number) => {
          console.log(idRef.current);
          const bar = typ === GewinnTyp.BAR ? val : stateBarRef.current;
          const pp = typ === GewinnTyp.PAYPAL ? val : statePayPalRef.current;
          update({name: props.name, gewinnBar: bar, gewinnPayPal: pp, id: idRef.current} as DbGewinn);
        }, () => GewinnTyp.BAR ? stateBarRef.current : statePayPalRef.current);
        if (gewinn > 0 ) addBuchung({name: props.name, gewinnTyp: typ, gewinn: gewinn, zeit: Date.now()} as DbBuchung);
      },
      reset: () => {
        sgw(0);
        setGwBar(0);
        setGwPayPal(0);
      },
      convert: (betrag: number, neuerTyp: GewinnTyp) => {
        if (neuerTyp === GewinnTyp.BAR) {
          erhoeheGewinn(betrag, setGwBar, () => stateBarRef.current);
          erhoeheGewinn(-betrag, setGwPayPal, () => statePayPalRef.current);
        } else {
          erhoeheGewinn(betrag, setGwPayPal, () => statePayPalRef.current);
          erhoeheGewinn(-betrag, setGwBar, () => stateBarRef.current);
        }
        const bar = neuerTyp === GewinnTyp.BAR ? stateBarRef.current + betrag : stateBarRef.current - betrag;
        const pp = neuerTyp === GewinnTyp.PAYPAL ? statePayPalRef.current + betrag : statePayPalRef.current - betrag;
        update({name: props.name, gewinnBar: bar, gewinnPayPal: pp, id: idRef.current} as DbGewinn);
        setGwBar(bar);
        setGwPayPal(pp);
      }
    } as OverviewCardRef;
  }, [update, addBuchung, props.name]);
    return idRef && <Card header={<h2 className="name dark:text-white">{props.name}</h2>}>
        <div className='grid grid-cols-3'>
          <div style={{width: "10%"}}>
            <Logo width={"100%"} />
          </div>
          <div style={{width: "100%"}} className='col-span-2'>
        <div className="gewinn" style={{width: "100%"}}>{gw.toLocaleString('de-de', {minimumFractionDigits: 2})} €</div>
        <div className="detail dark:text-white" style={{width: "100%"}}><Icon className='detailIcon'><BsCashCoin /></Icon>{gwBar.toLocaleString('de-de', {minimumFractionDigits: 2})} €<Icon className='detailIcon'><SlPaypal /></Icon>{gwPayPal.toLocaleString('de-de', {minimumFractionDigits: 2})} €</div>
        </div>
        </div>
        </Card>
     ;
});
