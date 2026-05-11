import Styles from './footer-style.less';
const Footer: React.FC = () => {
  return (
    <footer className={Styles.footer}>
      <img src="/images/eos-logo.svg" alt="logo" />
      <span>Powered by EOS Solutions </span>
    </footer>
  );
};

export default Footer;
