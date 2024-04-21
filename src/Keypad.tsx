import { Button } from "konsta/react";
import { forwardRef, useImperativeHandle, useState } from "react";
import './Keypad.css';

function screen(value: string) {
    return <div className="display dark:text-white">{value}</div>
}

function calc(val: number, comma: boolean, current: number): number {
    return !comma ? (current * 10) + val
        : current + (val / (current % 1 === 0 ? 10 : 100));
}

function updateVal(val: number, setFunction: (val: number) => void, notifyFunction: (val: number) => void) {
    setFunction(val);
    notifyFunction(val);
}

type KeypadProps = {
    onChange: (value: number) => void;
}

export type KeypadRef = {
    reset: () => void;
}

export const Keypad = forwardRef((props: KeypadProps, ref) => {
    const [currentVal, setCurrentVal] = useState(0);
    const [comma, setComma] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            reset: () => {
                setCurrentVal(0);
                setComma(false);
            }
        } as KeypadRef
    });

    return <>{screen(currentVal.toLocaleString('de-de', {minimumFractionDigits: 2}))}<div className="grid grid-cols-3 gap-x-4 gap-y-4">
    {[...Array(9)].map((_, i) => <Button large raised rounded style={{fontSize: "2em", height: "2.5em", aspectRatio: "1/1"}} onClick={() => updateVal(calc(i+1, comma, currentVal), setCurrentVal, props.onChange)} key={i}>{i+1}</Button>)}
    <Button large raised rounded className="k-color-brand-orange" style={{fontSize: "2em", height: "2.5em", aspectRatio: "1/1"}} onClick={() => {updateVal(0, setCurrentVal, props.onChange); setComma(false);}}>C</Button>
    <Button large raised rounded style={{fontSize: "2em", height: "2.5em", aspectRatio: "1/1"}} onClick={() => updateVal((currentVal * (comma ? 1 : 10)), setCurrentVal, props.onChange)}>0</Button>
    <Button large raised rounded className="k-color-brand-orange" style={{fontSize: "2em", height: "2.5em", aspectRatio: "1/1"}} onClick={() => setComma(true)} disabled={comma}>,</Button>
    </div></>
});