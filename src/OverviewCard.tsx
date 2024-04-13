import React from 'react';
import { useState, forwardRef } from 'react';
import { Card } from 'konsta/react';
import './OverviewCard.css'


type OverviewCardProps = {
    name: string;
    gewinn: number;
}

export type OverviewCardRef = {
    increase: (gewinn: number) => void;
}

function erhoeheGewinn(gewinn: number, setFunction: (value: number) => void) {
    
}

export function OverviewCard(props: OverviewCardProps) {
    return forwardRef<OverviewCardRef, OverviewCardProps>((props, ref) => {
    const [gw, sgw] = useState(props.gewinn);
    
    return <Card header={<h2 className="name">{props.name}</h2>}>
    <div className="gewinn">{gw.toFixed(2)} €</div>
    </Card>
    });
}