/* App.jsx */
import React, { MutableRefObject, useState } from 'react';
import { useRef } from 'react';
import { Button, App, Page, Navbar, Link, Icon, Tabbar, TabbarLink } from 'konsta/react';
import { OverviewCardRef } from './OverviewCard';
import { KeypadRef } from './Keypad';
import { initDB } from 'react-indexed-db-hook';
import { DBConfig } from './DBConfig';
import { FaCashRegister } from "react-icons/fa6";
import { ReactComponent as Logo} from './cash-register-solid.svg';
import { TiThMenu } from "react-icons/ti";
import { ActionMenu } from './ActionMenu';
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { Gewinn } from './Gewinn';
import { Buchungen } from './Buchungen';
import { RiHome2Fill } from "react-icons/ri";



initDB(DBConfig);

let refs: MutableRefObject<OverviewCardRef[]>;
let keypadRef: MutableRefObject<KeypadRef>;

function resetApp() {
  refs.current.forEach(ref => ref.reset());
  keypadRef.current.reset();
}

export default function MyApp() { 

    refs = useRef<OverviewCardRef[]>([]);
    const [actionOpen, setActionOpen] = useState(false);
    const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
    keypadRef = useRef<KeypadRef>(null);
    const [activeTab, setActiveTab] = useState('übersicht');

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
          { activeTab === 'übersicht' && <Gewinn keypadRef={keypadRef} refs={refs} />}
          { activeTab === 'buchungen' && <Buchungen />}
          <ActionMenu opened={actionOpen} close={() => setActionOpen(false)} resetApp={resetApp} dark={dark} setDark={setDark} />
        </Page>
      </App>
    );
}