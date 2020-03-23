import React, { Component } from "react";
import { Enhet } from "../../../../../../typer/enhet";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { fetchEnheter } from "../../../../../../klienter/serverKlient";
import { FieldProps } from "formik";
import Normaltekst from "nav-frontend-typografi/lib/normaltekst";
import { injectIntl, InjectedIntlProps } from "react-intl";
import NavFrontendSpinner from "nav-frontend-spinner";
import {
  Personalia,
  medPersonalia
} from "../../../../../../states/providers/Personalia";
import { FormattedMessage } from "react-intl";
import { TextField } from "@material-ui/core";

interface Props {
  valgtEnhet?: Enhet;
  label?: string;
  placeholder?: string;
  field: any;
}

interface State {
  enheter: Enhet[];
}

export interface EnhetOption {
  value: Enhet;
  label: string;
}

type MergedProps = Props & Personalia & FieldProps<any> & InjectedIntlProps;
class VisEnheter extends Component<MergedProps, State> {
  state = {
    enheter: [] as Enhet[]
  };

  componentDidMount = () => {
    this.hentEnheter();
  };

  hentEnheter = () =>
    fetchEnheter().then(enheter => this.setState({ ...this.state, enheter }));

  handleChange = (selected: Enhet | null) => {
    this.props.touched.valgtEnhet = false;
    if (selected) {
      this.props.field.value.valgtEnhet = selected;
    } else {
      this.props.field.value.valgtEnhet = undefined;
    }
  };

  render() {
    const { label } = this.props;
    const { enheter } = this.state;
    const touched = this.props.touched.valgtEnhet;
    const valgtEnhet = this.props.field.value.valgtEnhet;
    const error = touched && !valgtEnhet;

    return (
      <div className="visEnheter">
        {label && (
          <Normaltekst className="skjemaelement__label">{label}</Normaltekst>
        )}
        {!enheter.length ? (
          <NavFrontendSpinner />
        ) : (
          <Autocomplete
            onChange={(event: any, value: Enhet | null) => this.handleChange(value)}
            options={enheter}
            getOptionLabel={option => option.enhetsnavn}
            renderInput={params => <TextField {...params} label="NAV-kontor" variant="outlined" />}
            autoComplete={true}
            includeInputInList
            disableClearable={true}
          />
        )}
        {error && (
          <div className="skjemaelement__feilmelding">
            <FormattedMessage id="personalia.error.velgkontor" />
          </div>
        )}
      </div>
    );
  }
}

export default medPersonalia(injectIntl(VisEnheter));
