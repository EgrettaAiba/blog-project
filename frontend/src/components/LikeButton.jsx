export default function LikeButton({
  liked,
  count,
  onClick,
  disabled,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: "10px",
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "16px",
      }}
      title={disabled ? "Войди, дабы возлюбити" : "Возлюбити летопись"}
    >
      {liked ? "❤️" : "🤍"} {count}
    </button>
  );
}
