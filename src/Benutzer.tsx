import { Popup, Page, Navbar, Link, Block, List, ListInput, Dialog, DialogButton, Button } from "konsta/react";
import { FormEvent, Ref, forwardRef, useImperativeHandle, useState } from "react";
import { FaChild } from "react-icons/fa6";
import { useIndexedDB } from "react-indexed-db-hook";

export type BenutzerPanelProps = {
    onUserChange: (liste: string[]) => void;
    opened: boolean;
    close: () => void;
    benutzer: string[];
}

export type BenutzerPanelRef = {
    setUser: (userlist: string[]) => void;
}

export const BenutzerPanel = forwardRef<BenutzerPanelRef, BenutzerPanelProps>((props: BenutzerPanelProps, ref: Ref<BenutzerPanelRef>) => {
    console.log(props.benutzer);
    const [names, setNames] = useState([...props.benutzer]);
    const [confirmOpened, setConfirmOpened] = useState(false);

    const { clear } = useIndexedDB("gewinn");
    const clearBuchungen = useIndexedDB("buchungen").clear;

    useImperativeHandle<BenutzerPanelRef, BenutzerPanelRef>(ref, () => {
        return {
            setUser: (userList: string[]) => setNames(userList)
        } as BenutzerPanelRef
    });

    return <><Popup opened={props.opened} onBackdropClick={() => {
        props.close();
    }}>
    <Page>
      <Navbar
        title="Benutzer"
        right={
          <Link navbar onClick={() => {
            const edited = names.length !== props.benutzer.length || names.some((name, index) => name !== props.benutzer[index]);
            console.log("edited: " + edited);
            console.log("props");
            console.log(props.benutzer);
            setConfirmOpened(edited);
            if (!edited) props.close();
          }}>
            Speichern
          </Link>
        }
      />
      <Block className="space-y-4">
      <List strongIos insetIos>
        {names && names.map((name, index) => 
            <ListInput
            outline
            label="Name"
            floatingLabel
            type="text"
            placeholder="Your name"
            media={<FaChild />}
            defaultValue={name}
            onChange={(newValue: FormEvent<HTMLInputElement>) => {
                names[index] = newValue.currentTarget.value;
                setNames(names);
            }}
            clearButton
            onClear={() => setNames([...names.filter((n, i) => i !== index)])}
            key={name}
            />)}
        </List>
        <Button small onClick={() => setNames([...names, ""])}>+</Button>
      </Block>
      <Dialog
        className="dark:text-white"
        opened={confirmOpened}
        onBackdropClick={() => setConfirmOpened(false)}
        title="Speichern"
        content="Sollen die Änderungen gespeichert werden? Hierdurch gehen alle bisherigen Buchungen verloren!"
        buttons={
          <>
            <DialogButton onClick={() => {
                setConfirmOpened(false);
                props.close();
            }}>
              Abbrechen
            </DialogButton>
            <DialogButton strong onClick={() => {
                setConfirmOpened(false);
                clear().then(() => clearBuchungen().then(() => {
                    props.onUserChange(names);
                    props.close();
                }));
            }}>
              Speichern
            </DialogButton>
          </>
        }
      />
    </Page>
  </Popup></>
});