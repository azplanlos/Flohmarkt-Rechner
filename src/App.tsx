/* App.jsx */
import React from 'react';
import { useRef } from 'react';
import { Block, Button, App, Page, Navbar, Link, Icon } from 'konsta/react';
import { OverviewCard } from './OverviewCard'


export default function MyApp() { 

    let names = ["Lukas", "Andi"];

    const ref = useRef<OverviewCardRef>(null); 
                  
    return ( 
        <> 
           <App theme="ios" dark safeAreas>
        <Page>
          <Navbar title="Flohmarkt Kasse" left={
          <Link navbar iconOnly>
            <Icon
              ios={<img src="favicon-32x32.png" alt='' />}
            />
          </Link>
        } />
        <>
            {names.map(name => {return <OverviewCard name={name} gewinn={0} ref={ref} />})}
            </>
        </Page>
           </App>
        </>
    );
}