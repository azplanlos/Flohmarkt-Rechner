import { BlockTitle, Card, Table, TableHead, TableRow, TableCell, TableBody, Icon, Button, Block } from "konsta/react";
import { MutableRefObject, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { GewinnTyp, OverviewCardRef } from "./OverviewCard";
import { SlPaypal } from "react-icons/sl";
import { BsCashCoin } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";


type Buchung = {
    id: number;
    zeit: Date;
    name: string;
    betrag: number;
    typ: GewinnTyp;
}

function undo(buchung: Buchung, deleteRecord: (key: any) => Promise<any>, buchungen: Buchung[], setBuchungen: (buchungen: Buchung[]) => void, decreaseFunction: (name:string, amount: number, typ: GewinnTyp) => void) {
    deleteRecord(buchung.id);
    const bk = buchungen.filter((buch => buch.id !== buchung.id));
    setBuchungen(bk);
    decreaseFunction(buchung.name, buchung.betrag, buchung.typ);
}

type BuchungenProps = {
    decrease: (name:string, amount: number, typ: GewinnTyp) => void;
}

export function Buchungen(props: BuchungenProps) {

    const { getAll, deleteRecord } = useIndexedDB("buchungen");
    const [buchungen, setBuchungen] = useState<Buchung[]>([]);

    useEffect(() => {
        getAll().then((result) => {
            const bk: Buchung[] = [];
            result.forEach(dbResult => bk.push({zeit: new Date(dbResult.zeit), betrag: dbResult.gewinn, name: dbResult.name, typ: dbResult.gewinnTyp, id: dbResult.id}))
            setBuchungen(bk);
            return bk;
        });
    }, [getAll]);

    const dates = [...new Set(buchungen.map(buchung => buchung.zeit.toLocaleDateString()))];

    return <>
    { dates.length === 0 && <><BlockTitle>Buchungen</BlockTitle><Block><Card>Keine Buchungen vorhanden</Card></Block></>}
    { dates.map((date) => <>
        <BlockTitle key={date}>Buchungen {date}</BlockTitle>
        <Card className="block overflow-x-auto mt-8" contentWrap={false} key={"card-" + date}>
          <Table>
            <TableHead>
              <TableRow header>
                <TableCell header>Datum und Uhrzeit</TableCell>
                <TableCell header>Zahlung für</TableCell>
                <TableCell header>Typ</TableCell>
                <TableCell header className="text-right">Betrag</TableCell>
                <TableCell header>Aktion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buchungen.filter(buchung => buchung.zeit.toLocaleDateString() === date).map(buchung => {
                  return <TableRow key={"buchung-" + buchung.id}>
                      <TableCell>{buchung.zeit.toLocaleDateString()} {buchung.zeit.toLocaleTimeString()}</TableCell>
                      <TableCell>{buchung.name}</TableCell>
                      <TableCell><Icon>{buchung.typ === GewinnTyp.PAYPAL ? <SlPaypal /> : <BsCashCoin />}</Icon></TableCell>
                      <TableCell className="text-right">{buchung.betrag.toLocaleString('de-de', {maximumFractionDigits: 2, minimumFractionDigits: 2})} €</TableCell>
                      <TableCell className="grid grid-cols-2 gap-x-4 items-center"><Button outline small onClick={() => undo(buchung, deleteRecord, buchungen, setBuchungen, props.decrease)}><Icon><IoTrashOutline /></Icon></Button><Button outline small><Icon>{buchung.typ === GewinnTyp.BAR ? <SlPaypal /> : <BsCashCoin />}</Icon></Button></TableCell>
                  </TableRow>;
              })
          }
            </TableBody>
          </Table>
        </Card>
        </>
    )}
    </>
}