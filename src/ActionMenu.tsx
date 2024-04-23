import { Actions, ActionsGroup, ActionsLabel, ActionsButton, List, ListItem, Toggle } from "konsta/react";
import { useIndexedDB } from "react-indexed-db-hook";

type ActionMenuProps = {
    opened: boolean;
    close: () => void;
    resetApp: () => void;
    dark: boolean;
    setDark: (darkMode: boolean) => void;
    openBenutzerPanel: (value: boolean) => void;
}

export function ActionMenu(props: ActionMenuProps) {
    const { clear } = useIndexedDB("gewinn");
    const clearBuchungen = useIndexedDB("buchungen").clear;

    return <Actions opened={props.opened} onBackdropClick={() => props.close()}>
    <ActionsGroup>
      <ActionsLabel>Einstellungen</ActionsLabel>
      <ActionsButton bold onClick={() => {
        props.openBenutzerPanel(true);
        props.close();
      }}>Benutzer</ActionsButton>
      <ActionsButton onClick={() => {
          props.close();
          clear().then(() => {
            console.log("All Clear!");
            clearBuchungen().then(() => props.resetApp());
          });
        }} bold>
        Daten löschen
      </ActionsButton>
      <ActionsButton bold>
        <List>
            <ListItem
            label
            title="dunkler Modus"
            after={
                <Toggle
                component="div"
                className="-my-1"
                checked={props.dark}
                onChange={() => props.setDark(!props.dark)}
                />
            }
            />
        </List>
    </ActionsButton>
    </ActionsGroup>
    <ActionsGroup>
      <ActionsButton onClick={props.close}>
        Abbrechen
      </ActionsButton>
    </ActionsGroup>
  </Actions>
}