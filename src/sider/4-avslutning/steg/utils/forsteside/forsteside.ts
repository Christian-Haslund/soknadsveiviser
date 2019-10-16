import { Personalia } from "states/providers/Personalia";
import { hentVedleggslisteForJoark, hentDokumentliste } from "./lister";
import { Vedleggsobjekt } from "typer/skjemaogvedlegg";
import { adresseOgBrukerInfo } from "./json/brukerInfo";
import { Soknadsobjekt } from "typer/soknad";
import { velgGyldigLocale } from "./locale";
import { parseJson } from "klienter/parser";
import { sjekkForFeil } from "klienter/felles";
import { localeTekst } from "utils/sprak";
import { LocaleString } from "typer/sprak";
import { loggApiError } from "utils/logger";
import { Klage } from "typer/store";

export interface Params {
  personalia: Personalia;
  relevanteVedlegg: Vedleggsobjekt[];
  valgtSoknadsobjekt: Soknadsobjekt;
  klageSoknadsobjekt: Soknadsobjekt;
  globalLocale: string;
  valgtLocale: string;
  ettersendelse?: string;
  skalKlage?: boolean;
  typeKlage?: Klage;
  skalAnke?: boolean;
}

export const hentForsteside = (params: Params): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const url = "/soknader/api/forsteside";
    const {
      klageSoknadsobjekt,
      valgtSoknadsobjekt,
      ettersendelse,
      skalKlage,
      typeKlage,
      skalAnke
    } = params;
    const soknadsobjekt = skalKlage ? klageSoknadsobjekt : valgtSoknadsobjekt;
    const { navn, hovedskjema, innsendingsmate } = soknadsobjekt;
    const locale = velgGyldigLocale(params.valgtLocale, params.globalLocale);
    const vedleggSomSkalSendes = params.relevanteVedlegg
      .filter(vedlegg => !vedlegg.skalEttersendes)
      .map(vedlegg => vedlegg.vedlegg);

    const json = {
      foerstesidetype: ettersendelse ? "ETTERSENDELSE" : "SKJEMA",
      navSkjemaId: hovedskjema.skjemanummer,
      spraakkode: locale.toUpperCase(),
      overskriftstittel: hentOverskriftstittel(
        navn,
        locale,
        hovedskjema.skjemanummer,
        ettersendelse
      ),
      arkivtittel: hovedskjema.navn
        ? hentArkivtittel(hovedskjema.navn, ettersendelse)
        : "Finner ikke navn",
      tema: params.valgtSoknadsobjekt.tema.temakode,
      vedleggsliste: hentVedleggslisteForJoark(vedleggSomSkalSendes, locale),
      dokumentlisteFoersteside: hentDokumentliste(
        vedleggSomSkalSendes,
        hovedskjema,
        params.valgtLocale,
        params.ettersendelse
      ),
      ...adresseOgBrukerInfo(
        innsendingsmate,
        params.personalia,
        skalKlage,
        typeKlage,
        skalAnke
      )
    };

    console.group("Innsending førsteside-generator");
    if (
      window.location.hostname.includes("-q0") ||
      window.location.hostname.includes("localhost")
    ) {
      console.log(json);
    }
    console.groupEnd();

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json)
    })
      .then(response => sjekkForFeil(url, response))
      .then(parseJson)
      .then(response => response.foersteside)
      .then(resolve)
      .catch(err => reject && loggApiError(url, err));
  });

const hentArkivtittel = (navn: LocaleString, ettersendelse?: string) => {
  return ettersendelse
    ? "Ettersendelse til " + localeTekst(navn, "nb").toLocaleLowerCase()
    : localeTekst(navn, "nb");
};

const hentOverskriftstittel = (
  navn: LocaleString,
  locale: string,
  skjemanummer: string,
  ettersendelse?: string
) => {
  if (ettersendelse) {
    const ettersendelseTil = {
      nb: "Ettersendelse til",
      nn: "Ettersending til",
      en: "Forward to"
    };
    return `${localeTekst(ettersendelseTil, locale)} ${localeTekst(
      navn,
      locale
    ).toLocaleLowerCase()} ${skjemanummer}`;
  }
  return `${localeTekst(navn, locale)} ${skjemanummer}`;
};
