import { Popup, Page, Navbar, Link, Block } from "konsta/react";
import QRCode from "react-qr-code";
import './PaypalPopup.css';

export type PaypalPopupProps = {
    opened: boolean;
    close: () => void;
    amount: number;
}

export function PaypalPopup(props: PaypalPopupProps) {
    return <Popup opened={props.opened}>
    <Page>
    <Navbar
      title="PayPal Zahlung"
      right={
        <Link navbar onClick={props.close}>
          Schließen
        </Link>
      }
    />
    <Block strong>
      <div className="grid grid-cols-2 items-center" style={{padding: "5%"}}>
        <QRCode value={'https://paypal.me/andizoellner/' + props.amount.toFixed(2)} />
        <h2 className="popup">{props.amount.toLocaleString('de-de', {minimumFractionDigits: 2})} EUR</h2>
      </div>
    </Block>
    </Page>
  </Popup>
}