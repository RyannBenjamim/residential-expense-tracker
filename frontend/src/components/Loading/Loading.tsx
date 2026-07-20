import styles from "./styles.module.css";

interface LoadingProps {
  size?: string;
  color?: string;
}

const Loading = ({
  size = "40px",
  color = "#fff",
}: LoadingProps) => {
  return (
    <div
      className={styles.loading}
      style={{
        width: size,
        height: size,
        borderTop: `4px solid ${color}`,
      }}
    />
  );
};

export default Loading;
