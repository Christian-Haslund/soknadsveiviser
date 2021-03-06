import * as React from "react";
import Element from "nav-frontend-typografi/lib/element";
import EtikettLiten from "nav-frontend-typografi/lib/etikett-liten";
import { FormattedMessage } from "react-intl";
import { localeTekst } from "utils/sprak";
import { InjectedIntlProps, injectIntl } from "react-intl";
import LocaleTekst from "komponenter/localetekst/LocaleTekst";
import { hentPDFurl } from "./utils/pdf";
import { Skjema } from "typer/skjemaogvedlegg";
import { useParams } from "react-router";
import ReactGA from "react-ga";

ReactGA.initialize("UA-9127381-16");
ReactGA.set({ anonymizeIp: true });

interface Props {
  skjema: Skjema;
  visEtikett?: boolean;
  skjemaSprak: string;
}

type MergedProps = Props & InjectedIntlProps;
const Skjemavisning = (props: MergedProps) => {
  const { skjemaSprak, intl, visEtikett, skjema } = props;
  const { personEllerBedrift, kategori, underkategori } = useParams();

  // Definer url og filnavn
  const url = hentPDFurl(skjema.pdf, skjemaSprak, intl.locale);
  const tittel = `NAV - ${localeTekst(skjema.navn, skjemaSprak)}`;
  const filtype = url.split(".").pop() || "pdf";
  const filnavn = encodeURI(`${tittel}.${filtype}`);
  const filUrl = `${url}?dl=${filnavn}`;

  // Logg
  const loggGA = () =>
    ReactGA.event({
      category: "Søknadsveiviser",
      action: "Last ned skjema",
      label: `/${personEllerBedrift}/${kategori}/${underkategori}/${skjema.skjemanummer}/nedlasting/skjema`
    });

  return (
    <div className="skjema__container">
      {visEtikett && (
        <div className="skjema__etikett">
          <Element>
            <LocaleTekst tekst={skjema.navn} />
          </Element>
          <EtikettLiten>{skjema.skjemanummer}</EtikettLiten>
        </div>
      )}
      <div className="skjema__knapp">
        <a href={filUrl} className={"knapp knapp--hoved"} onClick={loggGA}>
          <FormattedMessage id="avslutning.steg.lastned.knapp.ready" />
        </a>
      </div>
    </div>
  );
};

export default injectIntl(Skjemavisning);
