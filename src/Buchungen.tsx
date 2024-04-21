import { BlockTitle, Card, Table, TableHead, TableRow, TableCell, TableBody, Icon } from "konsta/react";
import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { GewinnTyp } from "./OverviewCard";
import { SlPaypal } from "react-icons/sl";
import { BsCashCoin } from "react-icons/bs";

type Buchung = {
    zeit: Date;
    name: string;
    betrag: number;
    typ: GewinnTyp;
}

export function Buchungen() {

    const { getAll } = useIndexedDB("buchungen");
    const [buchungen, setBuchungen] = useState<Buchung[]>([]);

    useEffect(() => {
        getAll().then((result) => {
            const bk: Buchung[] = [];
            result.forEach(dbResult => bk.push({zeit: new Date(dbResult.zeit), betrag: dbResult.gewinn, name: dbResult.name, typ: dbResult.gewinnTyp}))
            setBuchungen(bk);
            return bk;
        });
    }, [getAll]);

    const dates = [...new Set(buchungen.map(buchung => buchung.zeit.toLocaleDateString()))];

    return <>
    { dates.map((date) => <>
        <BlockTitle>Buchungen {date}</BlockTitle>
        <Card className="block overflow-x-auto mt-8" contentWrap={false}>
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
                  return <TableRow>
                      <TableCell>{buchung.zeit.toLocaleDateString()} {buchung.zeit.toLocaleTimeString()}</TableCell>
                      <TableCell>{buchung.name}</TableCell>
                      <TableCell>{buchung.typ === GewinnTyp.PAYPAL ? <Icon><SlPaypal /></Icon> : <Icon><BsCashCoin /></Icon>}</TableCell>
                      <TableCell className="text-right">{buchung.betrag.toLocaleString('de-de', {maximumFractionDigits: 2, minimumFractionDigits: 2})} €</TableCell>
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