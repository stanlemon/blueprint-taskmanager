import Container from "rsuite/Container";
import Content from "rsuite/Content";

export default function ({ children, _style }) {
  const style = { padding: 20, ..._style };

  return (
    <Container style={style}>
      <Content>{children}</Content>
    </Container>
  );
}
