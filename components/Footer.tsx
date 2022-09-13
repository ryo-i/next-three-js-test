import Data from '../data/data.json';
import styled from 'styled-components';
import { pageSize } from '../styles/mixin';


const text = Data.footer.text;


// Style
const FooterTag = styled.footer`
  ${pageSize}
  padding: 30px;
  text-align: center;
  p {
    margin: 0;
  }
`;


// Component
function Footer() {
  return (
    <FooterTag>
        <p dangerouslySetInnerHTML={{ __html: text }}></p>
    </FooterTag>
  );
}

export default Footer;
