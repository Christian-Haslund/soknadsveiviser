import * as React from "react";
import { Input } from "nav-frontend-skjema";
import { injectIntl, FormattedMessage } from "react-intl";
import { FieldProps } from "formik";
import { Personalia, medPersonalia } from "../../../../../../states/providers/Personalia";
import { InjectedIntlProps } from "react-intl";

interface Fields {
  land?: string;
}

type MergedProps = FieldProps<Fields> & Personalia & InjectedIntlProps;
const Land = (props: MergedProps) => {
  const { intl, field, touched, settTouched } = props;
  return (
    <Input
      bredde="XL"
      maxLength={40}
      name="adresse.land"
      label={intl.formatMessage({ id: "personalia.label.land" })}
      value={field.value.land || ""}
      onChange={field.onChange}
      onBlur={() => settTouched({ ...touched, land: true })}
      feil={!field.value.land ? touched.land ? <FormattedMessage id="personalia.error.land" /> : undefined : undefined}
      autoComplete="country-name"
    />
  );
};

export default medPersonalia(injectIntl(Land));
