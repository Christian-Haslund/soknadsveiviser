import * as React from "react";
import { Field, FieldProps } from "formik";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { medPersonalia, Personalia } from "states/providers/Personalia";
import { ValgtEnhet } from "states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { Normaltekst, UndertekstBold } from "nav-frontend-typografi";
import InnsendingsEnhetsvelger from "./InnsendingsEnhetsvelger";
import { Enhetstype } from "../../../../../typer/soknad";

interface Routes {
  personEllerBedrift: string;
}

interface TiltaksbedriftProps {
  muligeEnheterForInnsending: Enhetstype[] | undefined;
}

type MergedProps = Personalia & RouteComponentProps<Routes> & InjectedIntlProps & TiltaksbedriftProps;
const TiltaksbedriftPanel = (props: MergedProps) => {
  const { intl, muligeEnheterForInnsending } = props;

  return (
    <Ekspanderbartpanel
      tittel={<Normaltekst>{intl.formatMessage({ id: "personalia.bedrift.tiltaksbedrift" })}</Normaltekst>}
    >
      <Field name="tiltaksbedrift" label="Tiltaksbedrift">
        {(pr: FieldProps<ValgtEnhet>) => (
          <>
            <UndertekstBold>
              <FormattedMessage id={"personalia.undertekstbold.tiltaksbedrift"} />
            </UndertekstBold>
            <InnsendingsEnhetsvelger
              label={intl.formatMessage({
                id: "personalia.label.velgnavkontor"
              })}
              placeholder={intl.formatMessage({
                id: "personalia.label.navkontor"
              })}
              enhetstyper={muligeEnheterForInnsending}
              {...pr}
            />
          </>
        )}
      </Field>
    </Ekspanderbartpanel>
  );
};

export default injectIntl(withRouter(medPersonalia(TiltaksbedriftPanel)));
