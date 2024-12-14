import FlexboxGrid from "rsuite/FlexboxGrid";

export function Columns({ className, children }) {
  return (
    <FlexboxGrid align="middle" className={className}>
      {children}
    </FlexboxGrid>
  );
}

export default Columns;
