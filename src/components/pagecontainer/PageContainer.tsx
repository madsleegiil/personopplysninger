import React from "react";
import { FormattedMessage } from "react-intl";
import Icon from "components/icon/Icon";
import Tilbake from "components/tilbake/Tilbake";
import Brodsmulesti, {
  BrodsmuleLenke,
} from "pages/forside/sections/2-brodsmulesti/Brodsmulesti";
import { Heading, Panel } from "@navikt/ds-react";

interface Props {
  children: JSX.Element | JSX.Element[];
  tittelId: string;
  backTo: string;
  icon?: string;
  brodsmulesti: BrodsmuleLenke[];
}

const PageContainer = (props: Props) => {
  return (
    <div className="da__container">
      <Brodsmulesti hierarki={props.brodsmulesti} />
      {props.icon && (
        <div className="da__icon">
          <Icon backgroundImage={props.icon} backgroundColor="#99C1E9" />
        </div>
      )}
      <div className="da__rad">
        <div className="da__back">
          <Tilbake to={props.backTo} />
        </div>
        <div className="da__overskrift">
          <Heading size={"medium"} level={"2"}>
            <FormattedMessage
              id={props.tittelId}
              values={{ br: () => <br /> }}
            />
          </Heading>
        </div>
        <div className="da__filler" />
      </div>
      <Panel className="da__innhold">{props.children}</Panel>
    </div>
  );
};

export default PageContainer;
