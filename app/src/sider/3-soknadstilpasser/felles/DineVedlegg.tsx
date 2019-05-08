import React, { ChangeEvent, useState } from "react";
import { Vedleggsobjekt } from "../../../typer/vedlegg";
import { Normaltekst, Undertittel, Element } from "nav-frontend-typografi";
import LocaleTekst from "../../../komponenter/localetekst/LocaleTekst";
import { settValgtVedleggSkalEttersendes } from "../../../states/reducers/vedlegg";
import { link } from "../../../utils/serializers";
import Modal from "nav-frontend-modal";
import AlertStripe from "nav-frontend-alertstriper";
import { SprakBlockText } from "../../../typer/sprak";
import BlockContent from "@sanity/block-content-to-react";
import { localeBlockTekst } from "../../../utils/sprak";
import {
  medValgtSoknadsobjekt,
  ValgtSoknad
} from "../../../states/providers/ValgtSoknadsobjekt";
import {
  InjectedIntlProps,
  injectIntl,
  FormattedMessage,
  FormattedHTMLMessage
} from "react-intl";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Radio } from "nav-frontend-skjema";

interface Props {
  relevanteVedlegg: Vedleggsobjekt[];
}

interface ReduxProps {
  settValgtVedleggSkalEttersendes: (
    vedleggId: string,
    skalEttersendes: boolean
  ) => void;
}

interface ModalContent {
  display: boolean;
  content?: SprakBlockText;
}

type MergedProps = Props & ValgtSoknad & InjectedIntlProps & ReduxProps;
const DineVedlegg = (props: MergedProps) => {
  const { relevanteVedlegg, intl } = props;
  const [showModal, setShowModal] = useState({
    display: false
  } as ModalContent);

  const vedleggTilEttersending = relevanteVedlegg.filter(
    vedlegg => vedlegg.skalEttersendes === true
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    props.settValgtVedleggSkalEttersendes(
      event.target.name,
      event.target.value === "off" ? true : false
    );

  let i = 0;

  return relevanteVedlegg.length > 0 ? (
    <div className="panel seksjon seksjon__avstand">
      <Undertittel>
        <FormattedMessage id="dinevedlegg.tittel" />
      </Undertittel>
      <div className="dinevedlegg__ingress">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.ingress" />
        </Normaltekst>
      </div>
      <form>
        <div className="dinevedlegg__wrapper">
          <div className="dinevedlegg__header">
            <div className="dinevedlegg__tittel" />
            <div className="dinevedlegg__checkbox">
              <FormattedMessage id="dinevedlegg.sender.na" />
            </div>
            <div className="dinevedlegg__checkbox">
              <FormattedMessage id="dinevedlegg.sender.senere" />
            </div>
          </div>
          <Modal
            isOpen={showModal.display}
            onRequestClose={() => setShowModal({ display: false })}
            closeButton={true}
            contentLabel="Modal"
          >
            {showModal.content && (
              <div className="dinevedlegg__modal">
                <BlockContent
                  blocks={localeBlockTekst(showModal.content, intl.locale)}
                  serializers={{ marks: { link } }}
                />
              </div>
            )}
          </Modal>
          {relevanteVedlegg
            .sort(a => (a.pakrevd ? -1 : 1))
            .map(({ vedlegg, pakrevd, _key, skalEttersendes, beskrivelse }) => (
              <div key={_key} className="dinevedlegg__vedlegg">
                <div className="dinevedlegg__id">{++i}.</div>
                <div className="dinevedlegg__tittel">
                  <Element>
                    {pakrevd && (
                      <FormattedHTMLMessage id="dinevedlegg.pakrevd" />
                    )}
                    <LocaleTekst tekst={vedlegg.navn} />
                    {beskrivelse && (
                      <span
                        className="lenke dinevedlegg__lenke"
                        onClick={() =>
                          setShowModal({
                            display: true,
                            content: beskrivelse
                          })
                        }
                      >
                        <FormattedMessage id="velgvedlegg.lesmer.hvaerdette" />
                      </span>
                    )}
                  </Element>
                </div>
                <div className="dinevedlegg__checkbox">
                  <Radio
                    value="on"
                    label={<span>&nbsp;</span>}
                    name={_key}
                    onChange={onChange}
                    checked={!skalEttersendes}
                  />
                </div>
                <div className="dinevedlegg__checkbox">
                  <Radio
                    value="off"
                    label={<span>&nbsp;</span>}
                    name={_key}
                    onChange={onChange}
                    checked={skalEttersendes}
                  />
                </div>
              </div>
            ))}
        </div>
      </form>
      {vedleggTilEttersending.length > 0 && (
        <AlertStripe type="advarsel">
          <FormattedMessage id="avslutning.advarsel" />
        </AlertStripe>
      )}
      <div className="dinevedlegg__beskrivelse">
        <Normaltekst>
          <FormattedMessage id="dinevedlegg.beskrivelse" />
        </Normaltekst>
      </div>
    </div>
  ) : null;
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  settValgtVedleggSkalEttersendes: (
    vedleggId: string,
    skalEttersendes: boolean
  ) => dispatch(settValgtVedleggSkalEttersendes(vedleggId, skalEttersendes))
});

export default medValgtSoknadsobjekt<Props & ValgtSoknad>(
  injectIntl<Props & ValgtSoknad & InjectedIntlProps>(
    connect(
      undefined,
      mapDispatchToProps
    )(DineVedlegg)
  )
);
