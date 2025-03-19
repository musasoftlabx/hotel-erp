export default function ModalStyles(props: {
  minWidth?: string | {};
  maxWidth?: string | {};
}) {
  return {
    border: "1px solid grey",
    borderRadius: "20px",
    left: "50%",
    minWidth: props.minWidth ?? 0,
    maxWidth: props.maxWidth ?? "40vw",
    overflow: "hidden",
    pb: 4,
    pt: 2,
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "9999",
    outline: 0,
  };
}
