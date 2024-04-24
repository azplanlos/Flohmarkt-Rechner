import { BlockTitle, Card, Table, TableHead, TableRow, TableCell, TableBody, Icon, Button, Block } from "konsta/react";
import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { DbBuchung, GewinnTyp } from "./OverviewCard";
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

function convert(buchung: Buchung, update: (value: DbBuchung) => Promise<any>, buchungen: Buchung[], setBuchungen: (buchungen: Buchung[]) => void, convertFunction: (name:string, amount: number, typ: GewinnTyp) => void) {
  update({id: buchung.id, gewinn: buchung.betrag, name: buchung.name, gewinnTyp: buchung.typ === GewinnTyp.BAR ? GewinnTyp.PAYPAL : GewinnTyp.BAR, zeit: buchung.zeit.getTime()} as DbBuchung);
  buchung.typ = buchung.typ === GewinnTyp.BAR ? GewinnTyp.PAYPAL : GewinnTyp.BAR;
  setBuchungen(buchungen.map(bk => bk.id === buchung.id ? buchung : bk));
  convertFunction(buchung.name, buchung.betrag, buchung.typ);
}

type BuchungenProps = {
    decrease: (name: string, amount: number, typ: GewinnTyp) => void;
    convert: (name: string, amount: number, alterTyp: GewinnTyp) => void;
}

export function Buchungen(props: BuchungenProps) {

    const { getAll, deleteRecord, update } = useIndexedDB("buchungen");
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
    { dates.length === 0 && <><BlockTitle className="dark:text-white">Buchungen</BlockTitle><Block><Card className="dark:text-white">Keine Buchungen vorhanden</Card></Block></>}
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
                  return <TableRow key={"buchung-" + buchung.id} className="dark:text-white">
                      <TableCell className="dark:text-white">{buchung.zeit.toLocaleDateString()} {buchung.zeit.toLocaleTimeString()}</TableCell>
                      <TableCell className="dark:text-white">{buchung.name}</TableCell>
                      <TableCell className="dark:text-white"><Icon>{buchung.typ === GewinnTyp.PAYPAL ? <SlPaypal /> : <BsCashCoin />}</Icon></TableCell>
                      <TableCell className="text-right dark:text-white">{buchung.betrag.toLocaleString('de-de', {maximumFractionDigits: 2, minimumFractionDigits: 2})} €</TableCell>
                      <TableCell className="grid grid-cols-2 gap-x-4 items-center">
                        <Button outline small onClick={() => undo(buchung, deleteRecord, buchungen, setBuchungen, props.decrease)}>
                          <Icon><IoTrashOutline /></Icon>
                        </Button>
                        <Button outline small onClick={() => convert(buchung, update, buchungen, setBuchungen, props.convert)}>
                          <Icon>{buchung.typ === GewinnTyp.BAR ? <SlPaypal /> : <BsCashCoin />}</Icon>
                        </Button>
                      </TableCell>
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