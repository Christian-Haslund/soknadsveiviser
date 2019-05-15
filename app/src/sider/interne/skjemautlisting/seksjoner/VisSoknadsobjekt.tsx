import React from "react";
import Element from "nav-frontend-typografi/lib/element";
import { Kategori } from "../../../../typer/kategori";
import { Underkategori } from "../../../../typer/underkategori";
import { Soknadsobjekt } from "../../../../typer/soknad";
import { injectIntl, InjectedIntlProps } from "react-intl";
import LocaleTekst from "../../../../komponenter/localetekst/LocaleTekst";
import { HashLink } from "react-router-hash-link";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { settValgtUnderkategori } from "../../../../states/reducers/kategorier";

interface Props {
  key: string;
  valgtSkjemanummer: string;
  soknadsobjekt: Soknadsobjekt;
  kategori: Kategori;
  underkategori: Underkategori;
}

interface ReduxProps {
  settValgtUnderkategori: (underkategori: Underkategori) => void;
}
const VisSoknadsobjekt = (props: Props & InjectedIntlProps & ReduxProps) => {
  const { kategori, underkategori, soknadsobjekt } = props;

  const { hovedskjema } = soknadsobjekt;
  const soknadsdialog =
    underkategori.inngangtilsoknadsdialog !== undefined &&
    underkategori.inngangtilsoknadsdialog.soknadsdialogURL;

  const lenkeTilSkjema =
    `/soknadsveiviser` +
    `/nb` +
    `/${kategori.domene.toLocaleLowerCase()}` +
    `/${kategori.urlparam}` +
    `/${underkategori.urlparam}`;

  return (
    <div
      id={hovedskjema.skjemanummer}
      key={props.key}
      className={
        `litenavstand ` +
        (props.valgtSkjemanummer === hovedskjema.skjemanummer
          ? "marker"
          : " ")
      }
    >
      <Element>{hovedskjema.skjemanummer + " – " + hovedskjema.navn.nb}</Element>
      <HashLink
        smooth={true}
        className="lenke"
        to={
          lenkeTilSkjema +
          (soknadsdialog ? "" : "/#" + hovedskjema.skjemanummer)
        }
        onClick={() => props.settValgtUnderkategori(underkategori)}
      >
        <LocaleTekst tekst={props.soknadsobjekt.navn} />
      </HashLink>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    settValgtUnderkategori: (underkategori: Underkategori) =>
      dispatch(settValgtUnderkategori(underkategori))
  };
};

export default injectIntl<Props & InjectedIntlProps>(connect(mapDispatchToProps)(VisSoknadsobjekt));
