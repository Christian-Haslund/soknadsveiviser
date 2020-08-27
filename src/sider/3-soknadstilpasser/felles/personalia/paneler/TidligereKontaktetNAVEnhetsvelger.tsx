import * as React from "react";
import { FieldProps } from "formik";
import { InjectedIntlProps, injectIntl } from "react-intl";
import Enhetsvelger from "./felter/Enhetsvelger";
import { Adresse } from "../../../../../states/providers/Personalia";
import { Enhet } from "../../../../../typer/enhet";
import { Enhetstype } from "../../../../../typer/soknad";
import { fetchEnheter } from "../../../../../klienter/serverKlient";
import { useEffect, useState } from "react";

interface Props {
  enhetstyper?: Enhetstype[];
  placeholder: string;
  label: string
}

type MergedProps = Props & InjectedIntlProps & FieldProps<Adresse>;

const TidligereKontaktetNAVEnhetsvelger = (props: MergedProps) => {
  const [enheter, setEnheter] = useState([] as Enhet[]);

  const handleChange = (value: Enhet | null) => {
    if (value) {
      props.field.value.kontaktetEnhet = value;
    } else {
      props.field.value.kontaktetEnhet = undefined;
    }
  };

  useEffect(() => {
    fetchEnheter(props.enhetstyper).then(enheter => setEnheter(enheter));
  }, [props.enhetstyper]);

  return (
    <Enhetsvelger
      handleChange={handleChange}
      enheter={enheter}
      {...props}
    />
  );
};

export default injectIntl(TidligereKontaktetNAVEnhetsvelger);
