import React, { Component } from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router";
import { Store } from "../../../typer/store";
import { Soknadsobjekt } from "../../../typer/soknad";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { connect } from "react-redux";
import DineVedlegg from "../felles/dinevedlegg/DineVedlegg";
import VelgVedleggEttersendelse from "./VelgVedlegg";
import Underbanner from "../../../komponenter/bannere/Underbanner";
import Personalia from "../felles/personalia/Personalia";
import Steg from "../../../komponenter/bannere/Steg";
import { Dispatch } from "redux";
import { medValgtSoknadsobjekt } from "../../../states/providers/ValgtSoknadsobjekt";
import { localeTekst } from "../../../utils/sprak";
import { nullstillVedlegg } from "../../../states/reducers/vedlegg";
import { sideTittel } from "../../../utils/sprak";

interface Props {
  valgtSoknadsobjekt: Soknadsobjekt;
}

interface ReduxProps {
  valgteVedlegg: Vedleggsobjekt[];
  nullstillVedlegg: (soknadsobjektId: string) => void;
}

interface Routes {
  skjemanummer: string;
  kategori: string;
  underkategori: string;
}

type MergedProps = Props &
  RouteComponentProps<Routes> &
  InjectedIntlProps &
  ReduxProps;

class Ettersendelse extends Component<MergedProps> {
  componentWillMount = () =>
    this.props.nullstillVedlegg(this.props.valgtSoknadsobjekt._id);

  componentDidMount() {
    const { valgtSoknadsobjekt, intl } = this.props;
    document.title = sideTittel(
      `${localeTekst(
        valgtSoknadsobjekt.navn,
        intl.locale
      )} - ${intl.formatMessage({ id: "ettersendelser.knapp" })}`
    );
  }

  render() {
    const { intl } = this.props;
    const { valgtSoknadsobjekt, valgteVedlegg } = this.props;

    const vedleggTilInnsending = valgteVedlegg
      .filter(v => v.soknadsobjektId === valgtSoknadsobjekt!._id)
      .filter(v => v.skalSendes);

    const { hovedskjema } = valgtSoknadsobjekt;
    return (
      <>
        <Underbanner
          tittel={localeTekst(valgtSoknadsobjekt.navn, intl.locale)}
          undertittel={localeTekst(hovedskjema.navn, intl.locale)}
          skjemanummer={hovedskjema.skjemanummer}
        />
        <Steg tittel="ettersendelser.tittel.underbanner" />
        <VelgVedleggEttersendelse soknadsobjekt={valgtSoknadsobjekt} />
        <DineVedlegg vedleggTilInnsending={vedleggTilInnsending} />
        <Personalia {...this.props} />
      </>
    );
  }
}

const mapStateToProps = (store: Store) => ({
  valgteVedlegg: store.vedlegg.valgteVedlegg
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  nullstillVedlegg: (soknadsobjektId: string) =>
    dispatch(nullstillVedlegg(soknadsobjektId))
});

export default medValgtSoknadsobjekt<Props>(
  injectIntl<Props & InjectedIntlProps>(
    withRouter<Props & InjectedIntlProps & RouteComponentProps<Routes>>(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(Ettersendelse)
    )
  )
);
