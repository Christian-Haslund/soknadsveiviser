import * as React from "react";
import { Field, FieldProps } from "formik";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { medPersonalia, Personalia } from "states/providers/Personalia";
import { ValgtEnhet } from "states/providers/Personalia";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import { UndertekstBold } from "nav-frontend-typografi";
import BrukerVelgerEnhet from "./BrukerVelgerEnhet";

interface Routes {
  personEllerBedrift: string;
}

type MergedProps = Personalia & RouteComponentProps<Routes> & InjectedIntlProps;
const FlerePersonerPanel = (props: MergedProps) => {
  const { intl } = props;

  return (
    <Ekspanderbartpanel
      border={true}
      tittel={intl.formatMessage({ id: "personalia.bedrift.tiltaksbedrift" })}
      tittelProps="normaltekst"
    >
      <Field
        name="tiltaksbedrift"
        label="Tiltaksbedrift"
        render={(pr: FieldProps<ValgtEnhet>) => (
          <>
            <UndertekstBold>
              <FormattedMessage
                id={"personalia.undertekstbold.tiltaksbedrift"}
              />
            </UndertekstBold>
            <BrukerVelgerEnhet
              label={intl.formatMessage({
                id: "personalia.label.velgnavkontor"
              })}
              placeholder={intl.formatMessage({
                id: "personalia.label.navkontor"
              })}
              {...pr}
            />
          </>
        )}
      />
    </Ekspanderbartpanel>
  );
};

export default injectIntl(withRouter(medPersonalia(FlerePersonerPanel)));
