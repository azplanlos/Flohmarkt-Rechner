/* App.jsx */
import React, { MutableRefObject, useState } from 'react';
import { useRef } from 'react';
import { Button, App, Page, Navbar, Link, Icon, Tabbar, TabbarLink } from 'konsta/react';
import { GewinnTyp, OverviewCard, OverviewCardRef } from './OverviewCard';
import { KeypadRef } from './Keypad';
import { initDB, useIndexedDB } from 'react-indexed-db-hook';
import { DBConfig } from './DBConfig';
import { FaCashRegister } from "react-icons/fa6";
import { ReactComponent as Logo} from './cash-register-solid.svg';
import { TiThMenu } from "react-icons/ti";
import { ActionMenu } from './ActionMenu';
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { Gewinn } from './Gewinn';
import { Buchungen } from './Buchungen';
import { RiHome2Fill } from "react-icons/ri";
import { BenutzerPanel, BenutzerPanelRef } from './Benutzer';



initDB(DBConfig);

let refs: MutableRefObject<OverviewCardRef[]>;
let keypadRef: MutableRefObject<KeypadRef>;

function resetApp() {
  refs.current.forEach(ref => {if (ref !== undefined && ref !== null) ref.reset();});
  if (keypadRef !== null && keypadRef.current !== null) keypadRef.current.reset();
}

function decrease(name: string, betrag: number, typ: GewinnTyp, names: string[]) {
    refs.current[names.indexOf(name)].increase(-(betrag), typ);
}

function convert(name: string, betrag: number, neuerTyp: GewinnTyp, names: string[]) {
    refs.current[names.indexOf(name)].convert(betrag, neuerTyp);
}

export type DbUser = {
  name: string;
  id?: number;
}

export default function MyApp() { 

    refs = useRef<OverviewCardRef[]>([]);
    const benutzerRef = useRef<BenutzerPanelRef>(null);
    const [actionOpen, setActionOpen] = useState(false);
    const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    keypadRef = useRef<KeypadRef>(null);
    const [activeTab, setActiveTab] = useState('übersicht');
    const [benutzerPanel, setBenutzerPanel] = useState(false);
    const [names, setNames] = useState(["Lukas", "Andi"]);
    const { getAll, clear, add } = useIndexedDB("benutzer");

    function useOnceCall(cb: () => void, condition = true) {
      const isCalledRef = React.useRef(false);
    
      React.useEffect(() => {
        if (condition && !isCalledRef.current) {
          isCalledRef.current = true;
          cb();
        }
      }, [cb, condition]);
    }

    useOnceCall(() => {
      getAll().then((benutzer: DbUser[]) => {
        if (benutzer.length > 0) {
          setNames(benutzer.map((dbUser: DbUser) => dbUser.name));
          benutzerRef.current.setUser(benutzer.map((dbUser: DbUser) => dbUser.name));
        } else {
          names.forEach(name => add({name: name}).then(() => console.log("added user " + name), error => console.log("user exists")));
        }
      })
    });

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
          <Tabbar labels={false} icons={true} className="left-0 bottom-0 fixed">
            <TabbarLink
              active={activeTab === 'übersicht'}
              onClick={() => setActiveTab('übersicht')}
              icon={
                  <Icon
                    ios={<RiHome2Fill className="w-7 h-7" />}
                    material={<RiHome2Fill className="w-6 h-6" />}
                  />
              }
            />
            <TabbarLink
              active={activeTab === 'buchungen'}
              onClick={() => setActiveTab('buchungen')}
              icon={
                  <Icon
                    ios={<BsReverseListColumnsReverse className="w-7 h-7" />}
                    material={<BsReverseListColumnsReverse className="w-6 h-6" />}
                  />
              }
            />
          </Tabbar>
          {names.map((name: string, index: number) => {return <OverviewCard name={name} gewinn={0} ref={el => refs.current[index] = el} key={name} />})}
          { activeTab === 'übersicht' && <Gewinn keypadRef={keypadRef} refs={refs} names={names}/>}
          { activeTab === 'buchungen' && <Buchungen key="buchungen" decrease={(name, betrag, typ) => {
              decrease(name, betrag, typ, names)
          }} convert={(name, betrag, typ) => convert(name, betrag, typ, names)}/>}
          <BenutzerPanel onUserChange={(newNames) => {
            clear().then(async () => await newNames.forEach(async name => {
              await add({name: name});
              setNames([...newNames]);
              setActiveTab('übersicht');
              resetApp();
            }));
          }} opened={benutzerPanel} close={() => setBenutzerPanel(false)} benutzer={names} ref={benutzerRef} />
          <ActionMenu opened={actionOpen} close={() => setActionOpen(false)} resetApp={resetApp} dark={dark} setDark={setDark} openBenutzerPanel={() => setBenutzerPanel(true)} />
        </Page>
      </App>
    );
}