export default function Center({ children }) {
  return (
    <div
      style={{ textAlign: "center", marginLeft: "auto", marginRight: "auto" }}
    >
      {children}
    </div>
  );
}
