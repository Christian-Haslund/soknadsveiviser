import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import { Soknadsobjekt } from "../../../typer/soknad";
import DigitalEttersendelse from "./seksjoner/Digital";
import PapirEttersendelse from "./seksjoner/Papir";
import KlageEttersendelse from "./seksjoner/Klage";
import { localeTekst } from "../../../utils/sprak";
import { finnesDigitalInnsending } from "../../../utils/soknadsobjekter";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { sideTittel } from "../../../utils/sprak";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props & RouteComponentProps<Routes> & InjectedIntlProps;
class DigitalEllerPapirEttersendelse extends Component<MergedProps> {
  render() {
    const { valgtSoknadsobjekt } = this.props;
    const { intl } = this.props;
    const { hovedskjema } = valgtSoknadsobjekt;
    const erDigital = finnesDigitalInnsending(valgtSoknadsobjekt, intl.locale);

    document.title = sideTittel(
      `${intl.formatMessage({
        id: "ettersendelser.mellomledd.tittel"
      })} - ${localeTekst(valgtSoknadsobjekt.navn, intl.locale)}`
    );

    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        {erDigital && <DigitalEttersendelse />}
        <PapirEttersendelse />
        <KlageEttersendelse />
      </>
    );
  }
}

export default medValgtSoknadsobjekt(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      DigitalEllerPapirEttersendelse
    )
  )
);
